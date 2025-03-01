# AmoonGS  
### 项目简介
项目使用 Gnirehtet 将网络共享给 Android 设备，并通过 adb 控制打开 Moonlight 软件，自动控制开始串流。

### 使用说明
1. 下载 Gnirehtet。
2. 将对应设备的脚本放置在 Gnirehtet 目录下。
3. 确保 adb 可用。
4. 运行对应的 `.bat` 或 `.cmd` 文件。

### GUI 使用说明
项目还提供了一个 GUI 界面，方便用户操作：
1. 确保已安装 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/)。
2. 在项目根目录下运行 `npm install` 安装依赖。
3. 运行 `npm start` 启动 GUI 界面。
4. 在 GUI 界面中，点击“启动 Gnirehtet 并打开软件”按钮以启动 Gnirehtet 并打开 Moonlight 软件。
5. 点击“关闭 Gnirehtet 并锁屏”按钮以停止 Gnirehtet 并锁屏。

### 可用设备
- Huawei MediaPad C3-BZA 

### 注意事项
由于 Moonlight 的特性，只能通过模拟点击来打开应用。其他设备需要自行修改 cmd 脚本来控制自动启动软件。

### 项目依赖
- [Gnirehtet](https://github.com/Genymobile/gnirehtet)
- [Moonlight-Android](https://github.com/moonlight-stream/moonlight-android)

### 许可证
该项目使用 Unlicense 许可证，允许任何人自由复制、修改、发布、使用、编译、销售或分发该软件，无论是源代码形式还是编译后的二进制形式，且不受任何限制。