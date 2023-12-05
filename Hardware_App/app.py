# Import necessary modules
import bme280
import smbus
import time
import requests

# Define the IP address and port for the server where sensor data will be sent
ip_addr = "http://192.168.235.52:8080"
port = 1

# I2C addresses for the BME280 and ISL29125 sensors
bme280_addr = 0x77
isl29125_addr = 0x44

# Initialize the I2C bus
bus = smbus.SMBus(port)

# Define a global variable to store sensor data
global sensor_data
global sensor_data_dict
sensor_data_dict = {}

# Set a placeholder, used when Sensor-values are not available
placeholder = "N/A"
sensor_data = placeholder

# Define a global variable to count iterations since the last transmission
global iteration_count
iteration_count = 0

# Function to read RGB color values from the ISL29125 sensor
def read_color_values(bus, addr):
    # Trigger a measurement on the ISL29125
    bus.write_byte(addr, 0x00)
    sleep(0.5)
    # Read the RGB color values
    data = bus.read_i2c_block_data(addr, 0x09, 3)
    return data[0], data[1], data[2]

# Main loop to continuously read and send sensor data
def loop():
    while True:
        try:
            # Read RGB color values from the ISL29125 sensor
            red, green, blue = read_color_values(bus, isl29125_addr)
        except:
            red = placeholder
            green = placeholder
            blue = placeholder

        try:
            # Load calibration parameters and read data from the BME280 sensor
            bme280.load_calibration_params(bus, bme280_addr)
            bme280_data = bme280.sample(bus, bme280_addr)
            humidity = bme280_data.humidity
            pressure = bme280_data.pressure
            ambient_temperature = bme280_data.temperature
        except:
            humidity = placeholder
            pressure = placeholder
            ambient_temperature = placeholder

        # Update the sensor data with the humidity value
        sensor_data = humidity
        
        # Create a dict with sensor data
        sensor_dict = {
            "sensors": {
                "Humidity": humidity,
                "Pressure": pressure,
                "Temperature": ambient_temperature,
                "Red": red,
                "Green": green,
                "Blue": blue
            }
        }

        # Store the sensor data in the dictionary with the current Linux timestamp as the key
        sensor_data_dict[int(time.time())] = sensor_dict
        
        global iteration_count

        # only send data every 6 hours
        if iteration_count >= 11:
            # Send the sensor data to the specified server using an HTTP POST request
            requests.post(url=f"{ip_addr}/location/data", json=sensor_data_dict)
            # Reset the iteration count
            iteration_count = 0

	# increment the iteration count
        iteration_count+=1
        
        # Sleep for 30 minutes before the next iteration
        time.sleep(1800)

if __name__ == "__main__":
    # Iterate through I2C addresses to find connected sensors
    for i in range(0, 128):
        try:
            bus.read_byte(i)  
            print(f"Sensor found at address: 0x{hex(i)[2:]}")
        except IOError:
            pass

    # Start the main sensor data collection and transmission loop
    loop()
