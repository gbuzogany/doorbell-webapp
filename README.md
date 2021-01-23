# ESP32-CAM + nrf52 Doorbell Camera PoC Webapp

This is a webapp to interact with the nrf52 using Web Bluetooth.

## Summary

I have a project that uses an nrf52 that controls a mosfet powering an ESP32-CAM for a cheap and simple battery-powered doorbell camera. 

The nrf52 consumes ~1mA while making BLE advertisements. The ESP32-CAM is only powered when the system is asked to take a snapshot.

This webapp will:
- Connect to the nrf52 using Web Bluetooth.
- Set the LED property (LBS service) ON, which will trigger the mosfet ON powering the ESP32-CAM.
- Wait 5 seconds.
- Request for a snapshot from the ESP32-CAM.
- When the snapshot is complete, will clear the LED property (LBS service), powering off the ESP32-CAM.
