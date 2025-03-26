# app.py
import sys
from time import sleep
from flask import Flask, request
import os
import asyncio
import websockets
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Required for Flask-SocketIO

root_dir = os.path.dirname(os.path.dirname(__file__))
config_path = os.path.join(root_dir, "config", "config.json")


openmanus_dir = sys.path.append(os.path.join(root_dir, "server", "openmanus"))  # Add the server directory to Python path
print('openmanus_dir', openmanus_dir)

from openmanus.app.agent.manus import Manus
from openmanus.app.schema import AgentState
agent = Manus()

from fastapi import FastAPI, WebSocket
import asyncio
import json

app = FastAPI()

@app.get("/")
async def hello():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/config_exists")
async def config_exists():
    # Implement your logic here
    return {"exists": True}

@app.post("/api/save_config")
async def save_config():
    # Implement your logic here
    return {"status": "Config saved"}

@app.get("/api/prompt")
async def prompt():
    # Implement your logic here
    return {"status": "Prompt sent"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            if message['action'] == 'prompt':
                task_id = message.get('task_id', 'default_task')
                prompt_text = message.get('prompt', 'summary aapl stock trends this year')
                # Implement your task handling logic here
                await websocket.send_text(json.dumps({
                    'task_id': task_id,
                    'status': 'running',
                    'message_content': 'Processing...'
                }))
    except Exception as e:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
