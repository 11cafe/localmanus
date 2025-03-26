# app.py
import sys
from time import sleep
import time
import traceback
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
    await agent.run('aapl stock trends this year')
    return {"status": "Prompt sent"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            state = agent.state  # Replace with actual method to get state if needed
            last_message_content = agent.memory.messages[-1].content if agent.memory.messages else "No messages yet."

            await websocket.send_text(json.dumps({
                'agent_state': state,
                'message': last_message_content
            }))
            
            await asyncio.sleep(1)  
    except Exception as e:
        traceback.print_exc()
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
