import json
import urllib.request
import urllib.error
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.config import settings
from app import crud

def send_telegram_raw(text: str, chat_id: Optional[str] = None, parse_mode: str = "HTML") -> Dict[str, Any]:
    """
    Sends a message to a Telegram chat or channel via Telegram Bot API.
    If no token is configured, returns mock simulation status with instructions.
    """
    token = settings.TELEGRAM_BOT_TOKEN
    target_chat = chat_id or settings.TELEGRAM_CHAT_ID

    if not token or not target_chat:
        return {
            "status": "simulation",
            "message": "Telegram токен или Chat ID не указаны в настройках (.env). Сообщение сформировано успешно.",
            "preview": text,
            "configured": False
        }

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": target_chat,
        "text": text,
        "parse_mode": parse_mode,
        "disable_web_page_preview": True
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return {
                "status": "success",
                "message": "Сообщение успешно отправлено в Telegram",
                "telegram_response": res_data,
                "configured": True
            }
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        return {
            "status": "error",
            "message": f"Ошибка Telegram API: {err_msg}",
            "configured": True
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Ошибка соединения: {str(e)}",
            "configured": True
        }

def send_sprint_summary_to_telegram(db: Session, chat_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Builds and sends a rich formatted report of project sprints and overall progress.
    """
    overview = crud.get_sprints_overview(db)
    stats = crud.get_dashboard_stats(db)

    lines = [
        "📊 <b>PMS: Сводка по спринтам и проектам</b>",
        "─────────────────────────",
    ]

    for p in overview:
        name = p.get("project", "Проект")
        overall = p.get("overallProgress", 0)
        sprints = p.get("sprints", [])
        s3 = next((s for s in sprints if s.get("id") == 3), None)
        s3_text = f"Спринт 3: {s3['percent']}%" if s3 else "В процессе"

        status_emoji = "🟢" if overall >= 75 else ("🟡" if overall >= 35 else "🔴")
        lines.append(f"{status_emoji} <b>{name}</b>: {overall}% ({s3_text})")

    lines.append("─────────────────────────")
    lines.append(f"👥 <b>Блогеры:</b> {stats.get('total_bloggers', 0)} в работе (${stats.get('total_spent_bloggers', 0):,})")
    lines.append(f"🎯 <b>Выполнение плана РНП:</b> {stats.get('rnp_completion_rate', 0)}%")
    lines.append(f"💼 <b>Всего проектов:</b> {stats.get('total_projects', 0)}")

    message_text = "\n".join(lines)
    return send_telegram_raw(message_text, chat_id=chat_id)

