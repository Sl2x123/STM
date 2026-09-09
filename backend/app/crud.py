from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import UserMonthPlan, Epic, PlanItem, SprintPlanItem, User, Month, Sprint, Project
from app.schemas import UserMonthPlanCreate, UserCreate, MonthCreate, SprintCreate, ProjectCreate
from app.auth import get_password_hash

# Projects
def get_projects(db: Session):
    return db.query(Project).all()

def create_project(db: Session, project: ProjectCreate):
    db_proj = Project(
        name=project.name, 
        description=project.description,
        start_date=project.start_date,
        end_date=project.end_date
    )
    db.add(db_proj)
    db.commit()
    db.refresh(db_proj)
    return db_proj

# Users
def get_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, full_name=user.full_name, role=user.role, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Months
def get_months(db: Session):
    return db.query(Month).all()

def create_month(db: Session, month: MonthCreate):
    db_month = Month(name=month.name, start_date=month.start_date, end_date=month.end_date)
    db.add(db_month)
    db.commit()
    db.refresh(db_month)
    
    for sprint_in in month.sprints:
        db_sprint = Sprint(name=sprint_in.name, start_date=sprint_in.start_date, end_date=sprint_in.end_date, month_id=db_month.id)
        db.add(db_sprint)
    db.commit()
    
    return db_month

def get_month_sprints(db: Session, month_id: int):
    return db.query(Sprint).filter(Sprint.month_id == month_id).all()

# Month Plan
def get_user_month_plan(db: Session, user_id: int, month_id: int):
    return db.query(UserMonthPlan).filter(UserMonthPlan.user_id == user_id, UserMonthPlan.month_id == month_id).first()

def create_user_month_plan(db: Session, user_id: int, plan_in: UserMonthPlanCreate):
    # Check if already exists
    existing_plan = get_user_month_plan(db, user_id, plan_in.month_id)
    if existing_plan:
        raise HTTPException(status_code=400, detail="Plan for this month already exists")

    # Create the container
    db_plan = UserMonthPlan(user_id=user_id, month_id=plan_in.month_id)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    for epic_in in plan_in.epics:
        db_epic = Epic(name=epic_in.name, user_month_plan_id=db_plan.id)
        db.add(db_epic)
        db.commit()
        db.refresh(db_epic)

        for item_in in epic_in.plan_items:
            # В новой парадигме мы не блокируем сохранение, если сумма спринтов не равна плану.
            # Система просто отслеживает распределение визуально.

            db_item = PlanItem(
                name=item_in.name, 
                month_plan=item_in.month_plan,
                epic_id=db_epic.id
            )
            db.add(db_item)
            db.commit()
            db.refresh(db_item)

            for sprint_in in item_in.sprint_items:
                db_sprint_item = SprintPlanItem(
                    plan_item_id=db_item.id,
                    sprint_id=sprint_in.sprint_id,
                    sprint_plan=sprint_in.sprint_plan,
                    sprint_fact=sprint_in.sprint_fact,
                    status=sprint_in.status
                )
                db.add(db_sprint_item)
            db.commit()

    return db_plan
