#!/bin/bash

# Warte 30 Sekunden, nachdem der Raspberry Pi gebootet ist
sleep 120

# Lade das Kernelmodul
sudo modprobe option

sleep 10

# Füge die Zeile in die new_id-Datei ein
echo "3566 2001 ff" | sudo tee /sys/bus/usb-serial/drivers/option1/new_id

sleep 10

# Wechsle den USB-Modus
sudo usb_modeswitch -v 3566 -p 2001 -X

sleep 10

# Starte wvdial
sudo wvdial
