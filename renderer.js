function sendCommand(command) {
    window.api.sendCommand(command).then((message) => {
        const logOutput = document.getElementById('log-output');
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logOutput.appendChild(logEntry);
        logOutput.scrollTop = logOutput.scrollHeight; // 自动滚动到底部
    }).catch((error) => {
        console.error('Command execution failed:', error);
    });
}

window.api.onCommandResult((message) => {
    const logOutput = document.getElementById('log-output');
    const gnirehtetLogOutput = document.getElementById('gnirehtet-log-output');
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

    if (message.includes('gnirehtet')) {
        gnirehtetLogOutput.appendChild(logEntry);
        gnirehtetLogOutput.scrollTop = gnirehtetLogOutput.scrollHeight; // 自动滚动到底部
    } else {
        logOutput.appendChild(logEntry);
        logOutput.scrollTop = logOutput.scrollHeight; // 自动滚动到底部
    }
});
