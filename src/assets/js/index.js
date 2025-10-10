const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("src/index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("run-command", async (_event, command) => {
  return new Promise((resolve, reject) => {
    let process;
    if (command === "start gnirehtet.exe run") {
      process = spawn(path.join(__dirname, "gnirehtet.exe"), ["run"], {
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      });
    } else {
      process = spawn(command, {
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      });
    }

    process.stdout.on("data", (data) => {
      const message = `✅ 执行成功: ${data.toString()}`;
      if (command.includes("gnirehtet")) {
        mainWindow.webContents.send(
          "command-result",
          `gnirehtet: ${command}: ${message}`
        );
      } else {
        mainWindow.webContents.send("command-result", `${command}: ${message}`);
      }
    });

    process.stderr.on("data", (data) => {
      const message = `⚠️ 警告: ${data.toString()}`;
      if (command.includes("gnirehtet")) {
        mainWindow.webContents.send(
          "command-result",
          `gnirehtet: ${command}: ${message}`
        );
      } else {
        mainWindow.webContents.send("command-result", `${command}: ${message}`);
      }
    });

    process.on("close", (code) => {
      if (code !== 0 && code !== 1) {
        reject(`❌ 错误: 进程以非零状态码 ${code} 退出`);
      } else {
        resolve("✅ 执行成功");
      }
    });
  });
});

ipcMain.on("exit-app", () => {
  app.quit();
});
