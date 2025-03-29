from fastapi import APIRouter, Request
from localmanus.services.config_service import ConfigService

router = APIRouter(prefix="/api/config")
config_service = ConfigService()

@router.get("/exists")
async def config_exists():
    return await config_service.exists_config()

@router.get("")
async def get_config():
    return await config_service.get_config()

@router.post("")
async def update_config(request: Request):
    data = await request.json()
    return await config_service.update_config(data) 