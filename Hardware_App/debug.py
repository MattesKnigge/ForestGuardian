# Import necessary modules
import bme280
import smbus
from time import sleep
import requests
import bme680

# Define the IP address and port for the server where sensor data will be sent
ip_addr = "http://192.168.78.52:8080"
port = 1

# I2C addresses for the BME280 and ISL29125 sensors
bme280_addr = 0x77
isl29125_addr = 0x44
bme680_addr = 0x77
mikroe_addr = 0x58

# Initialize the I2C bus
bus = smbus.SMBus(port)

# Define a global variable to store sensor data
global sensor_data
# Set a placeholder, used when Sensor-values are not available
placeholder = "N/A"
sensor_data = placeholder

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

        try:
            bme680_sensor = bme680.BME680(bme680_addr)
            print('Temperature: {} degrees C'.format(bme680_sensor.data.temperature))
            print('Gas: {} ohms'.format(bme680_sensor.data.gas_resistance))
            print('Humidity: {}%'.format(bme680_sensor.data.humidity))
            print('Pressure: {}hPa'.format(bme680_sensor.data.pressure))
        except:
            print("ne")

        print(humidity)
        print(red)
        # Update the sensor data with the humidity value
        sensor_data = humidity
        
        # Create a JSON object with sensor data
        sensor_json = {
            "sensors": {
                "Humidity": humidity,
                "Pressure": pressure,
                "Temperature": ambient_temperature,
                "Red": red,
                "Green": green,
                "Blue": blue
            }
        }
        
        # Send the sensor data to the specified server using an HTTP POST request
        requests.post(url=f"{ip_addr}/location/data", json=sensor_json)
        
        # Sleep for 5 seconds before the next iteration
        sleep(5)

if __name__ == "__main__":
    # Iterate through I2C addresses to find connected sensors
    for i in range(0, 255):
        print(f"{int((i+1)/255*100)}%")
        try:
            bus.read_byte(i)  
            print(f"Sensor found at address: 0x{hex(i)[2:]}")
        except IOError:
            pass
    print("scan finished")
    # Start the main sensor data collection and transmission loop
    loop()
