# Import necessary modules
import bme280
import smbus
import time
import requests
import datetime

# Define the IP address and port for the server where sensor data will be sent
ip_addr = "http://192.168.167.52:8000"
port = 1

# I2C addresses for the BME280 and ISL29125 sensors
bme280_addr = 0x77
isl29125_addr = 0x44

# Initialize the I2C bus
bus = smbus.SMBus(port)

# Define a global variable to store sensor data
global sensor_data
global sensor_dict
global sensor_data_dict
sensor_data_dict = {}
sensor_dict = {}
# Set a placeholder, used when Sensor-values are not available
placeholder = "N/A"
sensor_data = placeholder

# Define a global variable to count iterations since the last transmission
global iteration_count
iteration_count = 0

# Main loop to continuously read and send sensor data
def loop():
    while True:
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
        
        # Store the sensor data in the dictionary with the current Linux timestamp as the key
        sensor_dict[int(datetime.datetime.utcnow().timestamp())] = {
                "humidity": humidity,
                "pressure": pressure,
                "ambient_temperature": ambient_temperature,
                "co2": 500,
                "co": 2,
                "o2": 3,
                "light": 10000 
        }

        sensor_data_dict={
            "values":sensor_dict
        }
        
        global iteration_count
        print(iteration_count)
        # only send data every 6 hours
        if iteration_count >= 11:
            # Send the sensor data to the specified server using an HTTP POST request
            requests.post(url=f"{ip_addr}/sensorknoten-vogelhaus/location/data", json=sensor_data_dict)
            sensor_data_dict.clear()
            sensor_dict.clear()
            # Reset the iteration count
            iteration_count = 0

	    # increment the iteration count
        iteration_count+=1
        
        # Sleep for 30 minutes before the next iteration
        time.sleep(1)


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
