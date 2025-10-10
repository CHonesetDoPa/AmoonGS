const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendCommand: (command) => ipcRenderer.invoke("run-command", command),
  onCommandResult: (callback) =>
    ipcRenderer.on("command-result", (_event, message) => callback(message)),
  getAdbDevices: () => ipcRenderer.invoke("get-adb-devices"),
  exitApp: () => ipcRenderer.send("exit-app"),
});
