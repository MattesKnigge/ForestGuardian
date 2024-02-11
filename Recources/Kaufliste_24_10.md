 
**Microcontroller:**


- **Raspberry Pi Zero W**
  - Preis: 18,40€
  - Link: [Conrad Raspberry Pi Zero W](https://www.conrad.de/de/p/raspberry-pi-zero-w-w-o-gpio-raspberry-pi-zero-w-512-mb-1-x-1-0-ghz-1693283.html?refresh=true)
  - Begründung:
    - USB-A-Anschluss
    - Einfache Kameraverbindung
  - Nachteile:
    - Nicht gekennzeichnete Pins
    - Mäßig hoher Stromverbrauch (0,5-0,7 Watt): [Quelle](https://www.energie.web.de/ratgeber/verbrauch/stromverbrauch-rasperry/)
    (Für diesen entschieden, da dieser die Anbindung einer Kamera vereinfacht, zum Debuggen mit WLAN verbunden werden kann und über eine I2C Schnittstelle verfügt)
    
- **Micro-SD-Card**
    - Preis: 3,95€
    - 16GB
    - Link: [Reichelt Micro-SD](https://www.reichelt.de/microsdhc-speicherkarte-16gb-verbatim-class-10-verbatim-44010-p237763.html?&trstct=pol_11&nbc=1)
    (8GB würde auch gehen, jedich sind die preislichen Unterschiede sehr gering)

**Energy:**

- **Solar Panel: Solarmodule und Solarzellen 5V 5W Solar Panel - ETFE - Voltaic P105 **
  - 1 Stück zum testen genügt
  - Einzelpreis: 42,25€
  - Link: [Mouser Adafruit Solar Panel](https://www.mouser.de/ProductDetail/Adafruit/5367?qs=MyNHzdoqoQJL8FJqKm6mRw%3D%3D)
  - Abmessungen: 120mm*82mm*3mm
  - Spannung: 6,12V
  - Leistung: 5,75W
  - Begründung: Akzeptable Größe und akzeptable Leistung, Anschluss kompatibel mit Laderegler
  (Bitte schon am Anfang kaufen, obwohl wir erstmal mit USB arbeiten könnten, da wir so direkt reale Tests durchführen können, wie gut die Spannungsversorgung über die Solarpanels ist)

- **Laderegler: Adafruit Universal USB / DC / Solar Lithium Ion/Polymer charger - bq24074**
  - 1 Stück zum testen genügt
  - Einzelpreis: 28,61€
  - Link: [EXP-Tech SparkFun Sunny Buddy](https://exp-tech.de/products/sparkfun-sunny-buddy-mppt-solar-charger)
  - USB-C und JST-Anschluss
  - Anschluss kompatibel mit Solarpanel
  - Keine I2C- oder SPI-Unterstützung

- **Akku: PKNERGY Lithium-Ionen-Batterie Pack ICR 18650 3.7V 6600mAh LiPo Li-Ion mit JST-PH-Anschluss**
  - Preis: 19,29€
  - Link: [Conrad PKNERGY Lithium-Ionen-Batterie](https://www.conrad.de/de/p/pknergy-lithium-ion-battery-pack-icr-18650-3-7v-6600mah-lipo-li-ion-with-jst-ph-connector-871055382.html)
  - Spannung: 3,7V
  - JST-PH-Anschluss
  - (Durch den JST-PH-Anschluss einfach kompatibel mit Laderegler, genug Spannung, gute Speicherkapazität)

**Sensoren:**

- **Temperatur-, Luftfeuchtigkeits- und Luftdrucksensor: Joy-it-SEN-BME680**
  - Preis: 19,99€
  - Link: [Conrad Joy-it-SEN-BME680 Sensor](https://www.conrad.at/de/p/joy-it-sen-bme680-sensor-modul-1-st-1884870.html)
  (Dadurch, dass dieser Sensor 3 Werte abgibt, perfekt um ein Frontend mit einer Moderaten Menge an Werten zu zeigen)

- **Luftqualitätssensor (CO2-Äquivalenzkonzentration): MIKROE-2896**
  - Preis: 29,76€
  - Link: [Mouser MIKROE-2896 Sensor](https://www.mouser.de/ProductDetail/Mikroe/MIKROE-2896?qs=rrS6PyfT74dEs6OzyttedA%3D%3D)
  (Ein zweiter Sensor ist wichtig, um die Modularität des Sensor-Knotens zu demonstrieren)

**LTE:**

- **GNSS / GPS Development Tools SIM7600CE-T 4G (LTE) Arduino Shield**
  - Preis: 64,17€
  - Begründung: 
        - Globale verfügbarkeit (während beispielsweise LoRaWAN in Deutschland eine geringere Abdeckung aufweist)
        - Möglichkeit, große Daten zu übertragen
  - Link: [Mouser SIM7600CE-T Arduino Shield](https://www.mouser.de/ProductDetail/DFRobot/TEL0124?qs=17u8i%2FzlE88MEbXRJuYFsA%3D%3D)

- **LTE SIM-Karte**

**Kamera:**

- **Pi Zero Camera**
  - Preis: 18,30€
  - Kein Camera-to-Zero-Adapter wird benötigt
  - 2592 × 1944 Standbildauflösung
  - 120° FOV (Standart RPI-Kamera: 72°)
  - Link: [Reichelt RPIZ CAM 5MP](https://www.reichelt.de/raspberry-pi-zero-kamera-5mp-120--rpiz-cam-5mp-120-p242758.html)
  (Diese Kamera ist kostengünstig und ist in der Lage Bilder mit 120° FOV aufzunehmen und sie ist kompatibel mit dem Raspberry Pi Zero W)

**Kabel:**

- **Micro-USB-Kabel**
  - Preis: 5,03€
  - Link: [Conrad Micro-USB-Kabel](https://www.conrad.de/de/p/samsung-handy-kabel-1x-usb-stecker-1x-micro-usb-stecker-1-50-m-1891336.html)

- **Jumper-Kabel-Set (mit Breadboard)**
  - Preis: 16,80€
  - Link: [Conrad Jumper-Kabel-Set mit Breadboard](https://www.conrad.de/de/p/az-delivery-breadboard-kit-3x-jumper-wire-m2m-f2m-f2f-3er-set-mb102-breadbord-kompatibel-mit-arduino-raspberry-pi-850038804.html)

**Werkzeuge:**

- Lötkolben (Lötzinn, Lötlitze)
- Multimeter
- USB-Multimeter: [Conrad USB-Multimeter](https://www.conrad.de/de/p/joy-it-jt-um25c-usb-multimeter-1874702.html) (31,08€)
- Spanngurte 2 Stück, mindestens 1 Meter

**Summe:**
297,63€ + SIM-Karte und Versand
