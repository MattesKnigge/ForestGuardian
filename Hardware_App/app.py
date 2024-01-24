# Import necessary modules
import bme280
import smbus
import time
import requests
import datetime
import picamera
import base64
import Adafruit_ADS1x15

# Server Configuration
IP_ADDRESS = "http://10.82.48.101:8000"
PORT = 1

# Sensor I2C Addresses
BME280_ADDR = 0x77
ISL29125_ADDR = 0x44
MIKROE_3527_ADDR = 0x58
MQ_9B_ADDR = 0x48

# Initialize the ADS1115 ADC for the MQ-9B sensor
adc = Adafruit_ADS1x15.ADS1115()

# Initialize the I2C bus
bus = smbus.SMBus(PORT)

# Global variables for sensor data management
sensor_data_dict = {}
sensor_dict = {}
placeholder = "N/A"  # Placeholder for unavailable sensor values
iteration_count = 0  # Counter for iterations

def capture_and_send_image():
    """
    Captures an image using PiCamera and sends it to the server.
    """
    try:
        with picamera.PiCamera() as camera:
            camera.resolution = (1024, 768)
            camera.start_preview()
            time.sleep(2)  # Camera warm-up time
            image_path = '/home/pi/captured_image.jpg'
            camera.capture(image_path)

            # Image encoding and sending via HTTP
            encoded_image = base64.b64encode(open(image_path, 'rb').read())
            timestamp = int(datetime.datetime.utcnow().timestamp())
            response = requests.post(f"{IP_ADDRESS}/sensorknoten-vogelhaus/location/image", json={timestamp: encoded_image})

            if response.status_code == 200:
                print('Image successfully sent to the server.')
            else:
                print(f'Error sending the image to the server. Status code: {response.status_code}')
    except Exception as e:
        print(f'Error capturing and sending the image: {e}')

def read_color_values(bus, addr):
    """
    Reads RGB color values from the ISL29125 sensor.
    """
    try:
        bus.write_byte(addr, 0x00)
        time.sleep(0.5)
        data = bus.read_i2c_block_data(addr, 0x09, 3)
        return data[0], data[1], data[2]
    except Exception as e:
        print(f'Error reading color values: {e}')
        return 0, 0, 0

def get_serial():
    """
    Retrieves the current CPU serial number.
    """
    try:
        with open('/proc/cpuinfo', 'r') as f:
            for line in f:
                if line[0:6] == 'Serial':
                    return line[10:26]
    except Exception as e:
        print(f'Error getting CPU serial: {e}')
        return "0000000000000000"
    
def get_mq_9b():
    """
    Retrieves the current MQ-9B sensor value.
    """
    try:
        value = adc.read_adc(0, gain=1)
        sensor_volt = value * (4.096 / 32767.0) # Magic numbers given by a kind StackOverflow user
        co = (4.096 - sensor_volt) / sensor_volt
        return co
    except Exception as e:
        print(f'Error reading MQ-9B sensor: {e}')
        return placeholder

def calibrate_mq_9b():
    """
    Calibrates the MQ-9B sensor.
    Not needed in this case, would be needed for ratio calculation.
    """
    try:
        sensor_value = 0.0
        for i in range(100):
            sensor_value += adc.read_adc(0, gain=1)
        sensor_value /= 100
        sensor_volt = sensor_value * (4.096 / 32767.0) 
        RS_air = (4.096 - sensor_volt) / sensor_volt
        R0 = RS_air / 9.9
        return R0
    except Exception as e:
        print(f'Error calibrating MQ-9B sensor: {e}')
        return 0.0
    
def get_bme280():
    """
    Retrieves the current BME280 sensor values.
    """
    try:
        bme280.load_calibration_params(bus, BME280_ADDR)
        bme280_data = bme280.sample(bus, BME280_ADDR)
        return bme280_data.humidity, bme280_data.pressure, bme280_data.temperature
    except Exception as e:
        print(f'Error reading BME280 sensor: {e}')
        return placeholder, placeholder, placeholder
    
def get_mikroe_3527():
    """
    Retrieves the current Mikroe-3527 sensor value.
    """
    try:
        data = bus.read_i2c_block_data(MIKROE_3527_ADDR, 0x00, 6)
        return data[0] * 256 + data[1]
    except Exception as e:
        print(f'Error reading Mikroe-3527 sensor: {e}')
        return placeholder

def loop():
    """
    Main loop for reading and sending sensor data at regular intervals.
    """
    global iteration_count
    while True:
        red, green, blue = read_color_values(bus, ISL29125_ADDR)
        humidity, pressure, ambient_temperature = get_bme280()
        co2 = get_mikroe_3527()
        co = get_mq_9b()

        sensor_dict[int(datetime.datetime.utcnow().timestamp())] = {
            "humidity": humidity,
            "pressure": pressure,
            "ambient_temperature": ambient_temperature,
            "co2": co2,
            "co": co,
            "o2": placeholder,
            "light": (red + green + blue) / 3,
        }

        sensor_data_dict = {get_serial(): {"values": sensor_dict}}

        if iteration_count >= 11:
            requests.post(f"{IP_ADDRESS}/sensorknoten-vogelhaus/location/data", json=sensor_data_dict)
            sensor_data_dict.clear()
            sensor_dict.clear()
            capture_and_send_image()
            iteration_count = 0

        iteration_count += 1
        time.sleep(1)  # CHANGE LATER TO 1800!!!!!!!!!!!!!

if __name__ == "__main__":
    # Sensor detection
    for address in range(128):
        try:
            bus.read_byte(address)  
            print(f"Sensor found at address: 0x{hex(address)[2:]}")
        except IOError:
            pass

    loop()
