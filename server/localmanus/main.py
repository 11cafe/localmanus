import os
import sys

# Setup root directory
root_dir = os.path.dirname(os.path.dirname(__file__))
sys.path.append(root_dir)  # Add the server directory to Python path

# Add the openmanus directory to Python path
openmanus_dir = os.path.join(root_dir, "openmanus")
sys.path.append(openmanus_dir)

from fastapi import FastAPI
from localmanus.routers import config, agent, websocket

# Initialize FastAPI app
app = FastAPI()

# Include routers
app.include_router(config.router)
app.include_router(agent.router)
app.include_router(websocket.router)

@app.get("/")
async def hello():
    return {"message": "Hello from FastAPI!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
