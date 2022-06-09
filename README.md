# QRcode-Tool
* 一个二维码生成、扫码、识别工具
* 基于jQuery、Jimp、jsQR、QRCode
* 在线使用地址1：https://icedwatermelonjuice.github.io/QRcode-Tool/
* 在线使用地址2：https://gem-qr.rth.app/
* 可附加在url后的参数：  

|key|value|
|:-:|-----|
|darkmode|true：黑色模式<br>false：亮色模式<br>auto：跟随系统|
|mode|create：二维码生成页面<br>reader：二维码识别页面<br>scan：扫一扫页面|
|url|已经被"encodeURIComponent()"处理过的URL完整链接|
|autoJump|true：识别到内容是URL时自动跳转<br>false：不自动跳转|
|autoClose|true：URL跳转后自动关闭本页面<br>false：不关闭页面|
