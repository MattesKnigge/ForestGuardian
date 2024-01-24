# Import necessary modules
import bme280
import smbus
import time
import requests
import datetime
import picamera
import base64

# Define the IP address and port for the server where sensor data will be sent
ip_addr = "http://10.82.48.101:8000"
port = 1

# I2C addresses for the BME280 and ISL29125 sensors
bme280_addr = 0x77
isl29125_addr = 0x44
mikroe_3527_ADDR = 0x58

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

def capture_and_send_image():
    try:
        # Start using the camera
        with picamera.PiCamera() as camera:
            camera.resolution = (1024, 768)
            camera.start_preview()
            # Wait for 2 seconds to let the camera become ready
            time.sleep(2)

            # Save the captured image
            image_path = '/home/pi/captured_image.jpg'
            camera.capture(image_path)
            print('Image captured and saved:', image_path)
				
            # Send the image via HTTP request
            files = {
				int(datetime.datetime.utcnow().timestamp()): base64.b64encode(open(image_path, 'rb').read())
			}
            response = requests.post(url=f"{ip_addr}/sensorknoten-vogelhaus/location/image", json=files)

            # Check server response
            if response.status_code == 200:
                print('Image successfully sent to the server.')
            else:
                print('Error sending the image to the server. Status code:', response.status_code)

    except Exception as e:
        # Send error message
        error_message = f'Error capturing and sending the image: {str(e)}'
        print(error_message)
        # Display the error message to the user or save it to a file or perform any other desired operation

# Function to read RGB color values from the ISL29125 sensor
def read_color_values(bus, addr):
    # Trigger a measurement on the ISL29125
    bus.write_byte(addr, 0x00)
    time.sleep(0.5)
    # Read the RGB color values
    data = bus.read_i2c_block_data(addr, 0x09, 3)
    return data[0], data[1], data[2]

# Function that gives the current CPU-Serialnumber
def get_serial():
    try:
        with open('/proc/cpuinfo', 'r') as f:
            for line in f:
                if line[0:6] == 'Serial':
                    return(line[10:26])
    except:
        return("0000000000000000")

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

            # Read data from the ISL29125 sensor
            red, green, blue = read_color_values(bus, isl29125_addr)

            # Read data from the MIKROE_3527 sensor
            co2 = bus.read_i2c_block_data(MIKROE_3527_ADDR, 0x00, 6)[0]*265 + bus.read_i2c_block_data(MIKROE_3527_ADDR, 0x00, 6)[1]

        except:
            humidity = placeholder
            pressure = placeholder
            ambient_temperature = placeholder
            co2 = placeholder
            co = placeholder
            o2 = placeholder
            red, green, blue = 0, 0, 0

        
        # Store the sensor data in the dictionary with the current Linux timestamp as the key
        sensor_dict[int(datetime.datetime.utcnow().timestamp())] = {
                "humidity": humidity,
                "pressure": pressure,
                "ambient_temperature": ambient_temperature,
                "co2": co2,
                "co": 2,
                "o2": 3,
                "light": (red+green+blue)/3,

        }

        sensor_data_dict={
            get_serial(): {
                "values":sensor_dict
            }
        }
        
        global iteration_count
        print(iteration_count)
        # only send data every 6 hours
        if iteration_count >= 11:
            # Send the sensor data to the specified server using an HTTP POST request
            requests.post(url=f"{ip_addr}/sensorknoten-vogelhaus/location/data", json=sensor_data_dict)
            sensor_data_dict.clear()
            sensor_dict.clear()
            
            capture_and_send_image()

            # Reset the iteration count
            iteration_count = 0

        # increment the iteration count
        iteration_count += 1
        
        # Sleep for 30 minutes before the next iteration
        # XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  NEEDS TO BE CHANGED LATER   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
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
