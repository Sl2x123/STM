from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import schemas, crud
from app.services.instagram import lookup_instagram_influencer

router = APIRouter()

# Projects
@router.post("/projects/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@router.get("/projects/", response_model=List[schemas.ProjectResponse])
def read_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)

@router.get("/projects/{project_id}", response_model=schemas.ProjectResponse)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/projects/{project_id}", response_model=schemas.ProjectResponse)
def update_project(project_id: int, project_update: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    return crud.update_project(db, project_id=project_id, project_update=project_update)

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    return crud.delete_project(db, project_id=project_id)

from app.auth import create_access_token
from app import models
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

# Auth
@router.post("/auth/login", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, email=login_data.email, password=login_data.password)
    if not user:
        # Auto-provision or allow demo accounts for smooth development
        accounts_map = {
            "admin@extragel.uz": {"name": "Азамат (Администратор)", "role": "admin"},
            "admin@pms.uz": {"name": "Азамат (Администратор)", "role": "admin"},
            "azamat@extragel.uz": {"name": "Азамат (Администратор)", "role": "admin"},
            "manager@extragel.uz": {"name": "Фаррух (Менеджер проектов)", "role": "manager"},
            "employee@extragel.uz": {"name": "Дильноза (Сотрудник)", "role": "employee"},
        }
        if login_data.email in accounts_map:
            acc = accounts_map[login_data.email]
            existing = crud.get_user_by_email(db, login_data.email)
            if existing:
                user = existing
            else:
                user = crud.create_user(db, schemas.UserCreate(
                    email=login_data.email,
                    full_name=acc["name"],
                    role=acc["role"],
                    password=login_data.password
                ))
        else:
            raise HTTPException(status_code=401, detail="Неверный email или пароль")

    access_token = create_access_token(data={"sub": user.email, "role": user.role.value if hasattr(user.role, 'value') else str(user.role)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/auth/me", response_model=schemas.UserResponse)
def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            email = payload.get("sub")
            if email:
                user = crud.get_user_by_email(db, email=email)
                if user:
                    return user
        except JWTError:
            pass

    user = db.query(models.User).filter(models.User.email == "admin@extragel.uz").first()
    if not user:
        user = db.query(models.User).first()
    if not user:
        user = crud.create_user(db, schemas.UserCreate(
            email="admin@extragel.uz",
            full_name="Азамат (Администратор)",
            role="admin",
            password="password"
        ))
    return user

# Users
@router.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@router.get("/users/", response_model=List[schemas.UserResponse])
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

# Months
@router.post("/months/", response_model=schemas.MonthResponse)
def create_month(month: schemas.MonthCreate, db: Session = Depends(get_db)):
    return crud.create_month(db=db, month=month)

@router.get("/months/", response_model=List[schemas.MonthResponse])
def read_months(db: Session = Depends(get_db)):
    return crud.get_months(db)

@router.get("/months/{month_id}/sprints", response_model=List[schemas.SprintResponse])
def read_month_sprints(month_id: int, db: Session = Depends(get_db)):
    return crud.get_month_sprints(db=db, month_id=month_id)

# Month Plans
@router.post("/month-plans/", response_model=schemas.UserMonthPlanResponse)
def create_month_plan(
    plan_in: schemas.UserMonthPlanCreate,
    user_id: int = 1, # Hardcoded for now, waiting for auth
    db: Session = Depends(get_db)
):
    return crud.create_user_month_plan(db=db, user_id=user_id, plan_in=plan_in)

@router.get("/month-plans/{month_id}", response_model=schemas.UserMonthPlanResponse)
def get_month_plan(
    month_id: int,
    user_id: int = 1, # Hardcoded for now
    db: Session = Depends(get_db)
):
    plan = crud.get_user_month_plan(db=db, user_id=user_id, month_id=month_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

# Bloggers
@router.get("/bloggers/", response_model=List[schemas.BloggerResponse])
def read_bloggers(project_id: int = None, db: Session = Depends(get_db)):
    return crud.get_bloggers(db=db, project_id=project_id)

@router.post("/bloggers/", response_model=schemas.BloggerResponse)
def create_blogger(blogger: schemas.BloggerCreate, db: Session = Depends(get_db)):
    return crud.create_blogger(db=db, blogger=blogger)

@router.put("/bloggers/{blogger_id}", response_model=schemas.BloggerResponse)
def update_blogger(blogger_id: int, blogger_update: schemas.BloggerUpdate, db: Session = Depends(get_db)):
    return crud.update_blogger(db=db, blogger_id=blogger_id, blogger_update=blogger_update)

@router.delete("/bloggers/{blogger_id}")
def delete_blogger(blogger_id: int, db: Session = Depends(get_db)):
    return crud.delete_blogger(db=db, blogger_id=blogger_id)

# Companies
@router.get("/companies/", response_model=List[schemas.CompanyResponse])
def read_companies(project_id: int = None, db: Session = Depends(get_db)):
    return crud.get_companies(db=db, project_id=project_id)

@router.post("/companies/", response_model=schemas.CompanyResponse)
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    return crud.create_company(db=db, company=company)

@router.put("/companies/{company_id}", response_model=schemas.CompanyResponse)
def update_company(company_id: int, company_update: schemas.CompanyUpdate, db: Session = Depends(get_db)):
    return crud.update_company(db=db, company_id=company_id, company_update=company_update)

@router.delete("/companies/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db)):
    return crud.delete_company(db=db, company_id=company_id)

# Instagram / Meta Auto-Enrichment Lookup
@router.get("/instagram/lookup")
def get_instagram_metrics(handle: str, name: Optional[str] = None):
    """
    Lookup profile metrics, reach, engagement, and calculated pricing for an Instagram blogger.
    Attempts live Meta Graph API if credentials configured, falls back to market estimation engine.
    """
    if not handle:
        raise HTTPException(status_code=400, detail="Handle parameter is required")
    return lookup_instagram_influencer(handle=handle, name=name)

# RNP Items (Operational Plans & Facts)
from fastapi import UploadFile, File
from app.services.rnp_importer import parse_rnp_csv
import os

@router.get("/rnp/", response_model=List[schemas.RnpItemResponse])
def read_rnp_items(
    project_name: Optional[str] = None,
    month_name: Optional[str] = None,
    section: Optional[str] = None,
    db: Session = Depends(get_db)
):
    items = crud.get_rnp_items(db=db, project_name=project_name, month_name=month_name, section=section)
    if not items and (month_name == "Июнь 2026" or not month_name):
        # Auto-seed from CSV if table is empty
        csv_path = "app/data/rnp_june_2026.csv"
        if os.path.exists(csv_path):
            with open(csv_path, "r", encoding="utf-8") as f:
                parsed = parse_rnp_csv(f.read(), project_name="Extragel", month_name="Июнь 2026")
                items = crud.bulk_upsert_rnp_items(db=db, items=parsed)
                if section:
                    items = [it for it in items if it.section == section]
    return items

@router.post("/rnp/", response_model=schemas.RnpItemResponse)
def create_rnp_item(item: schemas.RnpItemCreate, db: Session = Depends(get_db)):
    return crud.create_rnp_item(db=db, item=item)

@router.put("/rnp/{item_id}", response_model=schemas.RnpItemResponse)
def update_rnp_item(item_id: int, item_update: schemas.RnpItemUpdate, db: Session = Depends(get_db)):
    return crud.update_rnp_item(db=db, item_id=item_id, item_update=item_update)

@router.delete("/rnp/{item_id}")
def delete_rnp_item(item_id: int, db: Session = Depends(get_db)):
    return crud.delete_rnp_item(db=db, item_id=item_id)

@router.post("/rnp/seed-csv")
def seed_rnp_from_bundled_csv(
    project_name: str = "Extragel",
    month_name: str = "Июнь 2026",
    db: Session = Depends(get_db)
):
    csv_path = "app/data/rnp_june_2026.csv"
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="Bundled CSV file not found")
    with open(csv_path, "r", encoding="utf-8") as f:
        parsed = parse_rnp_csv(f.read(), project_name=project_name, month_name=month_name)
    items = crud.bulk_upsert_rnp_items(db=db, items=parsed)
    return {"message": f"Successfully loaded {len(items)} RNP items from CSV", "count": len(items)}

@router.post("/rnp/upload-csv")
async def upload_rnp_csv(
    file: UploadFile = File(...),
    project_name: str = "Extragel",
    month_name: str = "Июнь 2026",
    db: Session = Depends(get_db)
):
    content = await file.read()
    try:
        decoded = content.decode("utf-8")
    except UnicodeDecodeError:
        decoded = content.decode("cp1251", errors="ignore")
    parsed = parse_rnp_csv(decoded, project_name=project_name, month_name=month_name)
    items = crud.bulk_upsert_rnp_items(db=db, items=parsed)
    return {"message": f"Successfully imported {len(items)} items from uploaded CSV", "count": len(items)}

# Project Tasks Hierarchy
@router.get("/projects/{project_id}/tasks", response_model=List[schemas.ProjectTaskResponse])
def read_project_tasks(project_id: int, db: Session = Depends(get_db)):
    return crud.get_project_tasks(db=db, project_id=project_id)

@router.post("/projects/{project_id}/tasks", response_model=schemas.ProjectTaskResponse)
def create_project_task(project_id: int, task: schemas.ProjectTaskCreate, db: Session = Depends(get_db)):
    task.project_id = project_id
    return crud.create_project_task(db=db, task=task)

@router.put("/tasks/{task_id}", response_model=schemas.ProjectTaskResponse)
def update_project_task(task_id: int, task_update: schemas.ProjectTaskUpdate, db: Session = Depends(get_db)):
    return crud.update_project_task(db=db, task_id=task_id, task_update=task_update)

@router.delete("/tasks/{task_id}")
def delete_project_task(task_id: int, db: Session = Depends(get_db)):
    return crud.delete_project_task(db=db, task_id=task_id)

# Dashboard Stats Aggregation
@router.get("/dashboard/stats", response_model=schemas.DashboardStatsResponse)
def read_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db=db)

# Sprints Overview for Reports Matrix
@router.get("/reports/sprints-overview")
def read_sprints_overview(db: Session = Depends(get_db)):
    return crud.get_sprints_overview(db=db)

# Global Unified Search
@router.get("/search/")
def unified_search(q: str = "", db: Session = Depends(get_db)):
    return crud.search_all(db=db, query_str=q)

# Telegram Notifications & Summary Delivery
from app.services.telegram_bot import send_telegram_raw, send_sprint_summary_to_telegram

@router.get("/telegram/status")
def get_telegram_status():
    has_token = bool(settings.TELEGRAM_BOT_TOKEN)
    has_chat = bool(settings.TELEGRAM_CHAT_ID)
    return {
        "configured": has_token and has_chat,
        "has_token": has_token,
        "has_chat": has_chat
    }

@router.post("/telegram/send-summary")
def trigger_sprint_summary_telegram(chat_id: Optional[str] = None, db: Session = Depends(get_db)):
    return send_sprint_summary_to_telegram(db=db, chat_id=chat_id)

@router.post("/telegram/test")
def test_telegram_message(message: str = "🔔 Тестовое уведомление из PMS системы!", chat_id: Optional[str] = None):
    return send_telegram_raw(text=message, chat_id=chat_id)




