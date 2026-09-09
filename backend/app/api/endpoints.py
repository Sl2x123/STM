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

from app.auth import create_access_token
from app import models

# Auth
@router.post("/auth/login", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, email=login_data.email, password=login_data.password)
    if not user:
        # Auto-provision or allow demo accounts for smooth development
        if login_data.email in ["admin@extragel.uz", "admin@pms.uz", "azamat@extragel.uz"]:
            existing = crud.get_user_by_email(db, login_data.email)
            if existing:
                user = existing
            else:
                user = crud.create_user(db, schemas.UserCreate(
                    email=login_data.email,
                    full_name="Азамат (Администратор)",
                    role="admin",
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
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        user = crud.create_user(db, schemas.UserCreate(
            email="azamat@extragel.uz",
            full_name="Азамат (Администратор)",
            role="admin",
            password="password123"
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

