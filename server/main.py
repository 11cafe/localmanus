# app.py
import sys
import traceback
import os
import asyncio
import json
from fastapi import FastAPI, WebSocket, Request 
import asyncio
import json
import toml
from typing import Dict, Any

root_dir = os.path.dirname(os.path.dirname(__file__))
config_path = os.path.join(root_dir, "config", "config.json")


openmanus_dir = sys.path.append(os.path.join(root_dir, "server", "openmanus"))  # Add the server directory to Python path
print('openmanus_dir', openmanus_dir)

from openmanus.app.agent.manus import Manus
from openmanus.app.schema import AgentState
agent = Manus()
agent.max_steps = 4
# Monkey patch the think method to check for the cancel event
original_think = agent.think
async def new_think():
    if cancel_event.is_set():
        raise Exception("Cancel event set")
        # return False
    return await original_think()
agent.think = new_think

app = FastAPI()
cancel_event = asyncio.Event()

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

@app.post("/api/prompt")
async def prompt(request: Request):  # Add Request as a parameter
    cancel_event.clear()
    data = await request.json() 
    prompt_text = data.get('prompt')  
    print('prompt_text', prompt_text)
    print(f"Agent type: {type(agent)}")
    # print(f"Run method: {agent.run}")
    # clear agent messages
    agent.memory.messages = []
    await agent.run(prompt_text)  # Use the extracted prompt text
    return {"success": True}

@app.get("/api/cancel")
async def cancel():
    global cancel_event  # Ensure we're using the global cancel_event
    cancel_event.set()   # Set the event
    return "Cancel event set"

@app.post("/api/config")
async def update_config(request: Request):
    try:
        # Get JSON data from request
        data = await request.json()
        
        # Read existing config
        config_file = os.path.join(root_dir, "server", "openmanus", "config", "config.toml")
        with open(config_file, 'r') as f:
            config = toml.load(f)
        
        # Update both llm and llm.vision configs with the same settings
        if 'llm' in data:
            llm_config = data['llm']
            for key in ['model', 'base_url', 'api_key', 'max_tokens', 'temperature']:
                if key in llm_config:
                    # Update main llm config
                    config['llm'][key] = llm_config[key]
                    # Update vision config with the same values
                    if 'llm.vision' not in config:
                        config['llm.vision'] = {}
                    config['llm.vision'][key] = llm_config[key]
        
        # Save updated config
        with open(config_file, 'w') as f:
            toml.dump(config, f)
        
        return {"status": "success", "message": "Configuration updated successfully"}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/config")
async def get_config():
    try:
        # Read config file
        config_file = os.path.join(root_dir, "server", "openmanus", "config", "config.toml")
        with open(config_file, 'r') as f:
            config = toml.load(f)
        
        # Mask API keys
        if 'llm' in config:
            if 'api_key' in config['llm']:
                config['llm']['api_key'] = '********'
        if 'llm.vision' in config:
            if 'api_key' in config['llm.vision']:
                config['llm.vision']['api_key'] = '********'
        
        return {"status": "success", "config": config}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            state = agent.state  # Replace with actual method to get state if needed
            messages = agent.memory.messages if agent.memory.messages else []
            await websocket.send_text(json.dumps({
                'agent_state': state,
                'messages': [message.to_dict() for message in messages],
                'current_step': agent.current_step,
                'max_steps': agent.max_steps,
                'total_tokens': agent.llm.total_input_tokens + agent.llm.total_completion_tokens,
            }))
            
            await asyncio.sleep(1)  
    except Exception as e:
        traceback.print_exc()
        try:
            await websocket.close()
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
