const { spawn } = require("child_process");

const port =
  process.argv.find((arg) => arg.startsWith("--port="))?.split("=")[1] ||
  "8000";

// 启动 Python FastAPI
const backend = spawn("python", ["server/localmanus/main.py", "--port", port]);

backend.stdout.on("data", (data) => {
  console.log(`[FastAPI]: ${data}`);
});

// 延迟几秒启动 Electron，确保前端可用
setTimeout(() => {
  const electron = spawn("npx", [
    "electron",
    "./electron/main.js",
    "--port",
    port,
  ]);
  electron.stdout.on("data", (data) => {
    console.log(`[Electron]: ${data}`);
  });
}, 3000);
