import asyncio

from fastapi import APIRouter, Request
from localmanus.services.agent_service import agent_service


router = APIRouter(prefix="/api")

@router.post("/prompt")
async def prompt(request: Request):
    data = await request.json()
    prompt_text = data.get('prompt')
    await agent_service.run_prompt(prompt_text)
    return {"success": True}

@router.get("/cancel")
async def cancel():
    agent_service.cancel_event.set()
    return "Cancel event set"