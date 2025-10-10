function sendCommand(command) {
  window.api
    .sendCommand(command)
    .then((message) => {
      addLogEntry("log-output", message);
    })
    .catch((error) => {
      console.error("Command execution failed:", error);
      addLogEntry("log-output", `错误: ${error.message}`, true);
      showErrorBox(`命令执行失败: ${error.message}`);
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
