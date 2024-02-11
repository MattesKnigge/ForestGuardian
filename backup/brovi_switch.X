#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# vim: filetype=bash

#   2023-01-28 Pavel Piatruk, piatruk.by
# switches BROVI to STICK mode

ID=$$
echo $ID
USB_ID=$(basename $DEVPATH)

{
echo bInterfaceClass on ports as follows 
grep -H .  /sys$DEVPATH/1*/bInterfaceClass 
IC=$( grep -h .  /sys$DEVPATH/*:1.0/bInterfaceClass )
echo "got bInterfaceClass on 1st port $IC"
echo usb_modeswitch -b $BUSNUM -g $DEVNUM -v 3566 -p 2001

case $IC in
08) 
    echo Storage MODE
    usb_modeswitch -b $BUSNUM -g $DEVNUM -v $ID_VENDOR_ID -p $ID_MODEL_ID  -X
    ;;
e0)
    echo "Already RNDIS"
    ;;
ff)
    echo Serial Port
    ;;
*)
    echo Unknown mode
    ;;
esac

} | logger -t BROVI

exit 0
