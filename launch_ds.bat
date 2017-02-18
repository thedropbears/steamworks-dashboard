@echo off



start "" "C:\Program Files (x86)\FRC Driver Station\DriverStation"
start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app=http://localhost:8888 --window-size=1400,580 --window-position=0,0

py -3 server.py --robot=10.47.74.2
