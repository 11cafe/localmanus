import asyncio
import os
from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import FileResponse
from localmanus.services.agent_service import agent_service
from openmanus.app.config import WORKSPACE_ROOT

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

@router.get("/workspace_list")
async def workspace_list():
    return [{"name": entry.name, "is_dir": entry.is_dir(), "path": str(entry)} for entry in Path(WORKSPACE_ROOT).iterdir()]

@router.get("/workspace_download")
async def workspace_download(path: str):
    file_path = Path(path)
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)
    return {"error": "File not found"}
