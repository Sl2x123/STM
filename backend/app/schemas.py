from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from app.models import RoleEnum, StatusEnum

# Projects
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    class Config:
        from_attributes = True

# Users & Teams
class UserBase(BaseModel):
    email: str
    full_name: str
    role: RoleEnum
    team_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    pass

class TeamResponse(TeamBase):
    id: int
    users: List[UserResponse] = []
    class Config:
        from_attributes = True

# Sprint & Month
class SprintBase(BaseModel):
    name: str
    start_date: date
    end_date: date

class SprintCreate(SprintBase):
    month_id: int

class SprintResponse(SprintBase):
    id: int
    month_id: int
    class Config:
        from_attributes = True

class MonthBase(BaseModel):
    name: str
    start_date: date
    end_date: date

class MonthCreate(MonthBase):
    sprints: List[SprintBase]

class MonthResponse(MonthBase):
    id: int
    sprints: List[SprintResponse]
    class Config:
        from_attributes = True

# Plan Items & Sprint Items
class SprintPlanItemBase(BaseModel):
    sprint_id: int
    sprint_plan: float
    sprint_fact: float = 0
    status: StatusEnum = StatusEnum.not_done

class SprintPlanItemCreate(SprintPlanItemBase):
    pass

class SprintPlanItemResponse(SprintPlanItemBase):
    id: int
    plan_item_id: int
    class Config:
        from_attributes = True

class SprintPlanItemUpdate(BaseModel):
    sprint_fact: Optional[float] = None
    status: Optional[StatusEnum] = None

class PlanItemBase(BaseModel):
    name: str
    month_plan: float

class PlanItemCreate(PlanItemBase):
    sprint_items: List[SprintPlanItemCreate]

class PlanItemResponse(PlanItemBase):
    id: int
    epic_id: int
    sprint_items: List[SprintPlanItemResponse]
    class Config:
        from_attributes = True

# Epics
class EpicBase(BaseModel):
    name: str

class EpicCreate(EpicBase):
    plan_items: List[PlanItemCreate]

class EpicResponse(EpicBase):
    id: int
    user_month_plan_id: int
    plan_items: List[PlanItemResponse]
    class Config:
        from_attributes = True

# User Month Plan
class UserMonthPlanCreate(BaseModel):
    month_id: int
    epics: List[EpicCreate]

class UserMonthPlanResponse(BaseModel):
    id: int
    user_id: int
    month_id: int
    epics: List[EpicResponse]
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

