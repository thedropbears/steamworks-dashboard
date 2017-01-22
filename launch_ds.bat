@echo off


REM The page order is so random...
start "" "C:\Program Files (x86)\FRC Driver Station\DriverStation"
start http://localhost:8888/ --window-size=1366,570 --window-position=0,0


cd %~dp0
py -3 server.py --robot 10.47.74.2
pause
