import os
import sys

if getattr(sys, 'frozen', False):
    # If running in a PyInstaller bundle, __file__ will point inside the bundle,
    # so you have to handle that carefully. Typically you use sys._MEIPASS
    # to find the "extracted" folder. For example:
    root_dir = os.path.join(sys._MEIPASS)
else:
    root_dir = os.path.dirname(__file__)

sys.path.append(root_dir)  # Add the server directory to Python path

# Add the openmanus directory to Python path
openmanus_dir = os.path.join(root_dir, "openmanus")
sys.path.append(openmanus_dir)

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from localmanus.routers import config, agent, websocket

# Initialize FastAPI app
app = FastAPI()

# Include routers
app.include_router(config.router)
app.include_router(agent.router)
app.include_router(websocket.router)

# Mount the React build directory
react_build_dir = os.path.join(os.path.dirname(root_dir), "react", "dist")
app.mount("/assets", StaticFiles(directory=os.path.join(react_build_dir, "assets")), name="assets")

@app.get("/")
async def serve_react_app():
    return FileResponse(os.path.join(react_build_dir, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
