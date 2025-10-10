const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;

function getGnirehtetPath() {
  if (app.isPackaged) {
    const exeDir = path.dirname(process.execPath);
    return path.join(exeDir, 'resources/gnirehtet.exe');
  } else {
    return path.resolve(__dirname, "../../../gnirehtet.exe");
  }
}

function sendCommandResult(command, message) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const isGnirehtet = typeof command === "string" && command.includes("gnirehtet");
  if (isGnirehtet) {
    mainWindow.webContents.send(
      "command-result",
      `gnirehtet: ${command}: ${message}`
    );
  } else if (command) {
    mainWindow.webContents.send("command-result", `${command}: ${message}`);
  } else {
    mainWindow.webContents.send("command-result", message);
  }
}

function sendSystemLog(message, level = "info") {
  const prefix = level === "error" ? "[System-Error]" : "[System]";
  sendCommandResult(null, `${prefix} ${message}`);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 720,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../../index.html"));

  mainWindow.webContents.on("did-finish-load", () => {
    // 使用原生方式去掉滚动条
    mainWindow.webContents.executeJavaScript(`
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    `);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

ipcMain.handle("run-command", async (_event, command) => {
  return new Promise((resolve, reject) => {
    let childProcess;
    let settled = false;
    
    sendSystemLog(`Executing command: ${command}`);
    
    if (command === "start gnirehtet.exe run") {
      sendSystemLog("Using special handling to start gnirehtet");
      const gnirehtetPath = getGnirehtetPath();
      childProcess = spawn(gnirehtetPath, ["run"], {
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      });
    } 
    // 处理adb命令
    else if (command.startsWith("adb ")) {
      // 检查是否包含shell操作符（如&&、||、|等）
      const hasShellOperators = /[&|;]/.test(command);
      
      if (hasShellOperators) {
        sendSystemLog("ADB command contains shell operators, executing via shell");
        // 包含shell操作符，使用shell执行
        childProcess = spawn(command, {
          shell: true,
          stdio: ["ignore", "pipe", "pipe"],
          windowsHide: true,
        });
      } else {
        sendSystemLog("Simple ADB command, calling ADB executable directly");
        // 简单的adb命令，直接调用adb可执行文件
        const args = command.slice(4).split(" "); // 移除"adb "前缀并分割参数
        sendSystemLog(`ADB arguments: ${JSON.stringify(args)}`);
        childProcess = spawn("adb", args, {
          stdio: ["ignore", "pipe", "pipe"],
          windowsHide: true,
        });
      }
    }
    // 其他命令使用shell执行（用于taskkill等）
    else {
      console.log("Other commands, executing via shell");
      childProcess = spawn(command, {
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      });
    }

    childProcess.stdout.on("data", (data) => {
      const message = `✅ Success: ${data.toString()}`;
      sendCommandResult(command, message);
    });

    childProcess.stderr.on("data", (data) => {
      const message = `⚠️ Warning: ${data.toString()}`;
      sendCommandResult(command, message);
    });

    childProcess.on("error", (error) => {
      const message = `❌ Error: ${error.message}`;
      sendCommandResult(command, message);
      sendSystemLog(`Command "${command}" execution failed`, "error");
      if (!settled) {
        settled = true;
        reject(error);
      }
    });

    childProcess.on("close", (code) => {
      sendSystemLog(`Command "${command}" exit code: ${code}`);
      if (!settled) {
        if (code !== 0 && code !== 1 && code !== null) {
          settled = true;
          reject(`❌ Error: Process exited with non-zero status code ${code}`);
        } else {
          settled = true;
          resolve("✅ Success");
        }
      }
    });
  });
});

ipcMain.handle("get-adb-devices", async () => {
  return new Promise((resolve, reject) => {
    const process = spawn("adb", ["devices"], {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let output = "";
    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      output += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0) {
        // 解析adb devices输出
        const lines = output.trim().split("\n");
        const devices = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const parts = line.split("\t");
            if (parts.length >= 2) {
              devices.push({
                id: parts[0],
                status: parts[1],
              });
            }
          }
        }
        resolve(devices);
      } else {
        reject(`❌ Failed to get ADB devices: ${output}`);
      }
    });
  });
});

ipcMain.on("exit-app", () => {
  app.quit();
});
