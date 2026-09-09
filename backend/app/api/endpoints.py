from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas, crud

router = APIRouter()

# Projects
@router.post("/projects/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@router.get("/projects/", response_model=List[schemas.ProjectResponse])
def read_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)

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

