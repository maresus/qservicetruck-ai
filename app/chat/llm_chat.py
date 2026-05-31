from __future__ import annotations

import os
from pathlib import Path
from openai import OpenAI

from app.rag.search import get_context

_SYSTEM_PROMPT_PATH = Path(__file__).parent / "prompts" / "system.txt"
_DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1").strip()


def _load_system_prompt() -> str:
    if _SYSTEM_PROMPT_PATH.exists():
        return _SYSTEM_PROMPT_PATH.read_text(encoding="utf-8").strip()
    return "Si pomočnik Q-Service Truck."


def chat(
    message: str,
    history: list[dict[str, str]] | None = None,
    client: OpenAI | None = None,
    model: str | None = None,
) -> dict[str, str]:
    if model is None:
        model = _DEFAULT_MODEL
    if client is None:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    rag_context = get_context(message, top_k=3)
    system_prompt = _load_system_prompt()

    if rag_context:
        system_prompt += f"\n\n## Dodatni kontekst iz baze znanja:\n{rag_context}"

    messages = [{"role": "system", "content": system_prompt}]
    if history:
        for msg in history[-6:]:
            messages.append(msg)
    messages.append({"role": "user", "content": message})

    response = client.responses.create(
        model=model,
        input=messages,
        max_output_tokens=500,
    )

    reply = getattr(response, "output_text", None)
    if not reply:
        outputs = []
        for block in getattr(response, "output", []) or []:
            for content in getattr(block, "content", []) or []:
                text = getattr(content, "text", None)
                if text:
                    outputs.append(text)
        reply = "\n".join(outputs).strip()

    if not reply:
        reply = "Oprostite, pri obdelavi vprašanja je prišlo do napake. Pokličite nas: +386 41 413 393"

    return {"reply": reply}
