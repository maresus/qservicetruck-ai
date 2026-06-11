from __future__ import annotations

import os
import smtplib
import uuid
from datetime import datetime, timezone, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.chat.llm_chat import chat

router = APIRouter(prefix="/chat", tags=["chat"])
admin_router = APIRouter(tags=["admin"])

_sessions: dict[str, dict] = {}
_conversations: list[dict] = []
_join_requests: list[dict] = []
_MAX_STORED = 5000

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "hljutic@intercars.eu")
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str


class JoinRequest(BaseModel):
    delavnica: str
    kontakt: str
    telefon: str
    email: str
    naslov: str
    davcna: str | None = None
    vozila: list[str] = []
    sporocilo: str | None = None


def _send_email(to: str, subject: str, html: str) -> bool:
    if not SMTP_HOST or not SMTP_USER:
        print(f"[email] SMTP ni konfiguriran — preskočeno (to={to})")
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = FROM_EMAIL
        msg["To"] = to
        msg.attach(MIMEText(html, "html", "utf-8"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.starttls()
            s.login(SMTP_USER, SMTP_PASS)
            s.sendmail(FROM_EMAIL, to, msg.as_string())
        return True
    except Exception as e:
        print(f"[email] Napaka: {e}")
        return False


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


@router.post("/join")
async def join_network(payload: JoinRequest):
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    vozila_str = ", ".join(payload.vozila) if payload.vozila else "—"

    _join_requests.append({
        "delavnica": payload.delavnica,
        "kontakt": payload.kontakt,
        "telefon": payload.telefon,
        "email": payload.email,
        "naslov": payload.naslov,
        "davcna": payload.davcna or "—",
        "vozila": vozila_str,
        "sporocilo": payload.sporocilo or "—",
        "created_at": ts,
    })

    # Email Hariju Ljutiću
    admin_html = f"""
    <html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#002B6E;padding:24px;border-radius:8px 8px 0 0;">
      <h2 style="color:#fff;margin:0;">Nova prijava za mrežo Q-Service Truck</h2>
      <p style="color:#7DC242;margin:4px 0 0;">Prejeto: {ts} UTC</p>
    </div>
    <div style="background:#f8f9fa;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;width:160px;"><b>Delavnica</b></td><td style="padding:8px 0;">{payload.delavnica}</td></tr>
        <tr><td style="padding:8px 0;color:#666;"><b>Kontaktna oseba</b></td><td style="padding:8px 0;">{payload.kontakt}</td></tr>
        <tr><td style="padding:8px 0;color:#666;"><b>Telefon</b></td><td style="padding:8px 0;"><a href="tel:{payload.telefon}" style="color:#002B6E;">{payload.telefon}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666;"><b>Email</b></td><td style="padding:8px 0;"><a href="mailto:{payload.email}" style="color:#002B6E;">{payload.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666;"><b>Naslov</b></td><td style="padding:8px 0;">{payload.naslov}</td></tr>
        <tr><td style="padding:8px 0;color:#666;"><b>Davčna številka</b></td><td style="padding:8px 0;">{payload.davcna or "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666;"><b>Vozila</b></td><td style="padding:8px 0;">{vozila_str}</td></tr>
        <tr><td style="padding:8px 0;color:#666;vertical-align:top;"><b>Sporočilo</b></td><td style="padding:8px 0;">{payload.sporocilo or "—"}</td></tr>
      </table>
      <hr style="margin:20px 0;border:none;border-top:1px solid #ddd;">
      <p style="color:#999;font-size:12px;">Poslano prek Q-Service Truck AI asistenta</p>
    </div>
    </body></html>
    """
    _send_email(ADMIN_EMAIL, f"Nova prijava v mrežo: {payload.delavnica}", admin_html)

    # Potrditveni email delavnici
    confirm_html = f"""
    <html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#002B6E;padding:24px;border-radius:8px 8px 0 0;">
      <h2 style="color:#fff;margin:0;">Hvala za prijavo, {payload.kontakt}!</h2>
      <p style="color:#7DC242;margin:4px 0 0;">Q-Service Truck — Prijava v mrežo</p>
    </div>
    <div style="background:#f8f9fa;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
      <p>Prejeli smo vašo prijavo za delavnico <b>{payload.delavnica}</b>.</p>
      <p>Hari Ljutić vas bo kontaktiral v najkrajšem možnem času za nadaljnje korake.</p>
      <div style="background:#002B6E;color:#fff;padding:16px;border-radius:8px;margin:20px 0;">
        <b>Kontakt za vprašanja:</b><br>
        Hari Ljutić — Manager Q-Service Truck Slovenija<br>
        📞 +386 41 413 393<br>
        ✉ hljutic@intercars.eu
      </div>
      <p style="color:#999;font-size:12px;">Q-Service Truck · Šmartinska cesta 52, 1000 Ljubljana</p>
    </div>
    </body></html>
    """
    _send_email(payload.email, "Potrditev prijave — Q-Service Truck mreža", confirm_html)

    return {"ok": True, "message": "Prijava uspešno poslana"}


@admin_router.get("/api/admin/conversations")
def get_conversations(hours: int = Query(default=24)):
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).strftime("%Y-%m-%d %H:%M:%S")
    filtered = [c for c in _conversations if c.get("created_at", "") >= cutoff]
    return {"conversations": filtered, "total": len(filtered)}


@admin_router.get("/api/admin/join-requests")
def get_join_requests():
    return {"requests": _join_requests, "total": len(_join_requests)}
