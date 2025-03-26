const { spawn } = require("child_process");

const port =
  process.argv.find((arg) => arg.startsWith("--port="))?.split("=")[1] ||
  "8000";

// 启动 Python FastAPI
const backend = spawn("python", ["web_run.py", "--port", port]);

backend.stdout.on("data", (data) => {
  console.log(`[FastAPI]: ${data}`);
});

// 启动 Vite 前端
// const frontend = spawn("npm", ["run", "dev"], { cwd: "frontend" });

// frontend.stdout.on("data", (data) => {
//   console.log(`[Frontend]: ${data}`);
// });

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
