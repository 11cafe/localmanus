from fastapi import APIRouter, Request
from localmanus.services.config_service import config_service
from localmanus.services.agent_service import agent_service

router = APIRouter(prefix="/api/config")

@router.get("/exists")
async def config_exists():
    return {"exists": await config_service.exists_config()}

@router.get("")
async def get_config():
    return await config_service.get_config()

@router.post("")
async def update_config(request: Request):
    data = await request.json()
    res = await config_service.update_config(data) 
    if res['status'] == 'success':
        agent_service.reload_agent()
    return res
