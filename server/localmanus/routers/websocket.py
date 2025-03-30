from fastapi import APIRouter, WebSocket
import json
import asyncio
from localmanus.services.agent_service import agent_service

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            state_data = await agent_service.get_state_data()
            await websocket.send_text(json.dumps(state_data))
            await asyncio.sleep(1)
    except Exception as e:
        try:
            await websocket.close()
        except:
            pass 