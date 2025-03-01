start gnirehtet.exe run
timeout /t 5
adb shell input keyevent POWER
adb shell input swipe 100 500 1000 500 300
adb shell input keyevent 3
adb shell input tap 180 360
timeout /t 10
adb shell input tap 265 175
adb shell input tap 380 300
adb shell input tap 310 360
pause
adb shell input keyevent 3
adb shell input tap 700 775
adb shell input tap 1200 400
taskkill /f /im gnirehtet.exe
adb shell input keyevent 3
adb shell input keyevent 26