/* eslint-disable no-unused-vars */
function sendCommand(command) {
  window.api
    .sendCommand(command)
    .then((message) => {
      addLogEntry("log-output", message);
    })
    .catch((error) => {
      console.error("Command execution failed:", error);
      addLogEntry("log-output", `Error: ${error.message}`, true);
      showErrorBox(`Command execution failed: ${error.message}`);
    });
}

function addLogEntry(logId, message, isError = false) {
  const logOutput = document.getElementById(logId);

  // 移除占位符
  const placeholder = logOutput.querySelector(".log-placeholder");
  if (placeholder) {
    placeholder.remove();
  }

  const logEntry = document.createElement("div");
  const timestamp = new Date().toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  logEntry.textContent = `[${timestamp}] ${message}`;

  if (isError) {
    logEntry.style.borderLeftColor = "#ef4444";
    logEntry.style.background = "#fef2f2";
    logEntry.style.color = "#991b1b";
  }

  logOutput.appendChild(logEntry);
  logOutput.scrollTop = logOutput.scrollHeight; // 自动滚动到底部

  // 限制日志条目数量，避免内存溢出
  const maxLogs = 100;
  while (logOutput.children.length > maxLogs) {
    logOutput.removeChild(logOutput.firstChild);
  }
}

function showErrorBox(message) {
  const errorBox = document.getElementById("error-box");
  const errorMessage = document.getElementById("error-message");

  errorMessage.textContent = message;
  errorBox.classList.remove("hidden");
}

/* eslint-disable no-unused-vars */
function hideErrorBox() {
  const errorBox = document.getElementById("error-box");
  errorBox.classList.add("hidden");
}

window.api.onCommandResult((message) => {
  if (message.toLowerCase().includes("gnirehtet")) {
    addLogEntry("gnirehtet-log-output", message);
  } else {
    addLogEntry("log-output", message);
  }
});

/* eslint-disable no-unused-vars */
async function getAdbDevices() {
  try {
    const devices = await window.api.getAdbDevices();
    displayAdbDevices(devices);
  } catch (error) {
    console.error("Failed to get ADB devices:", error);
    showErrorBox(`Failed to get ADB devices: ${error.message}`);
  }
}

function displayAdbDevices(devices) {
  const deviceSelect = document.getElementById("device-select");
  if (!deviceSelect) return;

  deviceSelect.innerHTML = "";

  if (!Array.isArray(devices) || devices.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No connected ADB devices detected';
    deviceSelect.appendChild(option);
    window._selectedDevice = null;
    return;
  }

  // 添加默认选项
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Please select a device...';
  deviceSelect.appendChild(defaultOption);

  // 将设备数据保存在全局
  window._adbDevices = devices.slice();

  devices.forEach((device) => {
    const statusText = device.status === "device" ? "online" : "offline";
    const option = document.createElement('option');
    option.value = device.id;
    option.textContent = `${device.id} (${statusText})`;
    option.dataset.status = device.status;
    deviceSelect.appendChild(option);
  });

  // 自动选中第一个在线设备
  const firstOnline = devices.find(d => d.status === 'device') || devices[0];
  if (firstOnline) {
    deviceSelect.value = firstOnline.id;
    selectDeviceBySelect();
  }
}

function selectDeviceBySelect() {
  const deviceSelect = document.getElementById("device-select");
  if (!deviceSelect) return;

  const deviceId = deviceSelect.value;
  const device = (window._adbDevices || []).find(d => d.id === deviceId) || null;
  window._selectedDevice = device;
}

function showDeviceInfo() {
  const d = window._selectedDevice;
  if (!d) {
    showErrorBox('Please select a device first');
    return;
  }

  const statusText = d.status === 'device' ? 'online' : 'offline';
  showErrorBox(`Device ${d.id} status: ${statusText}`);
}
