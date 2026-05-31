from __future__ import annotations

import uuid
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.chat.llm_chat import chat

router = APIRouter(prefix="/chat", tags=["chat"])
admin_router = APIRouter(tags=["admin"])

_sessions: dict[str, dict] = {}
_conversations: list[dict] = []
_MAX_STORED = 5000


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str


def _get_session(session_id: str | None) -> tuple[str, dict]:
    if session_id and session_id in _sessions:
        return session_id, _sessions[session_id]
    new_id = session_id or str(uuid.uuid4())
    _sessions[new_id] = {"history": [], "started": datetime.now(timezone.utc).isoformat()}
    return new_id, _sessions[new_id]


def _log_conversation(session_id: str, user_msg: str, bot_reply: str) -> None:
    global _conversations
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    _conversations.append({
        "session_id": session_id,
        "user_message": user_msg,
        "bot_response": bot_reply,
        "created_at": ts,
    })
    if len(_conversations) > _MAX_STORED:
        _conversations = _conversations[-_MAX_STORED:]


@router.post("", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
    session_id, session = _get_session(payload.session_id)
    message = payload.message.strip()

    result = chat(message=message, history=session["history"])

    session["history"].append({"role": "user", "content": message})
    session["history"].append({"role": "assistant", "content": result["reply"]})
    if len(session["history"]) > 20:
        session["history"] = session["history"][-20:]

    _log_conversation(session_id, message, result["reply"])

    return ChatResponse(reply=result["reply"], session_id=session_id)


@admin_router.get("/api/admin/conversations")
def get_conversations(hours: int = Query(default=24)):
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).strftime("%Y-%m-%d %H:%M:%S")
    filtered = [c for c in _conversations if c.get("created_at", "") >= cutoff]
    return {"conversations": filtered, "total": len(filtered)}
