# AmoonGS

### 项目简介
AmoonGS 是一个基于 Electron 的图形用户界面 (GUI) 工具，用于自动化 Gnirehtet 网络共享和 Moonlight 串流在 Android 设备上的操作。通过 ADB 控制，自动解锁设备、启动 Moonlight 软件并开始串流。

### 主要功能
- 自动化 Gnirehtet 服务启动/停止
- Android 设备解锁/锁屏控制
- Moonlight 串流自动化启动
- 实时日志显示 (Gnirehtet & ADB)
- 现代化的 Material Design 界面
- 支持构建为便携式 Windows 应用

### 系统要求
- Windows 操作系统
- [Node.js](https://nodejs.org/) (推荐 LTS 版本)
- [pnpm](https://pnpm.io/) 包管理器
- [ADB (Android Debug Bridge)](https://developer.android.com/studio/command-line/adb)
- [Gnirehtet](https://github.com/Genymobile/gnirehtet)
- [Moonlight Android](https://github.com/moonlight-stream/moonlight-android)

### 安装步骤
1. 克隆或下载项目：
   ```bash
   git clone https://github.com/CHonesetDoPa/amoonGS.git
   cd amoonGS
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 确保 ADB 和 Gnirehtet 已正确安装并在系统 PATH 中可用

### 使用说明
1. 启动应用：
   ```bash
   pnpm start
   ```

2. 在 GUI 界面中：
   - 从设备列表中选择目标 Android 设备
   - 点击"启动并执行"按钮启动 Gnirehtet 并自动解锁设备、启动 Moonlight
   - 点击"停止并关闭"按钮停止服务并锁屏设备
   - 单独控制 Gnirehtet 或 ADB 功能

### 构建应用
构建便携式 Windows 应用：
```bash
pnpm run build
```

构建后的文件位于 `dist` 目录中。

### 脚本配置
项目使用 `src/scripts/script.yaml` 文件定义自动化脚本。您可以根据设备和需求修改坐标和命令：
- `startGnirehtetAndUnlock`: 启动 Gnirehtet 并解锁设备启动 Moonlight
- `stopGnirehtetAndLock`: 停止 Gnirehtet 并锁屏设备
- `startGnirehtet`: 仅启动 Gnirehtet
- `stopGnirehtet`: 仅停止 Gnirehtet
- `unlockDevice`: 解锁设备
- `lockDevice`: 锁屏设备

### 可用设备
- Huawei MediaPad C3-BZA (已预配置)

### 注意事项
- 由于限制，只能通过模拟点击来打开应用
- 其他设备需要根据屏幕分辨率和应用位置修改 `script.yaml` 中的坐标
- 确保设备已启用 USB 调试模式
- 首次使用可能需要接受 ADB 授权

### 开发
- 清理构建文件：`pnpm run clean`
- 运行测试：`pnpm test`

### 许可证
该项目使用 [Unlicense](LICENSE) 许可证，允许任何人自由复制、修改、发布、使用、编译、销售或分发该软件，无论是源代码形式还是编译后的二进制形式，且不受任何限制。  
### 第三方组件许可证  
本项目引用了 [Gnirehtet](https://github.com/Genymobile/gnirehtet)，其遵循 [Apache License 2.0](https://github.com/Genymobile/gnirehtet/blob/master/LICENSE)。使用本项目时请遵守该许可证的相关条款。
