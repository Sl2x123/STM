from pydantic import BaseModel
from typing import List, Optional, Any
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

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

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

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

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

# Bloggers
class BloggerBase(BaseModel):
    name: str
    handle: str
    platform: Optional[str] = "Instagram"
    followers: Optional[str] = "100K"
    reach: Optional[str] = "20K"
    views: Optional[int] = 0
    format: Optional[str] = "Reels + 2 Stories"
    price: Optional[str] = "$250"
    status: Optional[str] = "Переговоры"
    publish_date: Optional[str] = None
    sprint: Optional[str] = "Спринт 2"
    profile_url: Optional[str] = None
    post_url: Optional[str] = None
    manager_contact: Optional[str] = None
    notes: Optional[str] = None
    project_id: Optional[int] = 1

class BloggerCreate(BloggerBase):
    pass

class BloggerUpdate(BaseModel):
    name: Optional[str] = None
    handle: Optional[str] = None
    platform: Optional[str] = None
    followers: Optional[str] = None
    reach: Optional[str] = None
    views: Optional[int] = None
    format: Optional[str] = None
    price: Optional[str] = None
    status: Optional[str] = None
    publish_date: Optional[str] = None
    sprint: Optional[str] = None
    profile_url: Optional[str] = None
    post_url: Optional[str] = None
    manager_contact: Optional[str] = None
    notes: Optional[str] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None
    saves: Optional[int] = None
    profile_visits: Optional[int] = None
    link_clicks: Optional[int] = None

class BloggerResponse(BloggerBase):
    id: int
    likes: int = 0
    comments: int = 0
    shares: int = 0
    saves: int = 0
    profile_visits: int = 0
    link_clicks: int = 0
    class Config:
        from_attributes = True

# Companies
class CompanyBase(BaseModel):
    name: str
    category: Optional[str] = "Гостиница / Отель"
    location: Optional[str] = None
    spent: Optional[str] = "$500"
    items_provided: Optional[str] = None
    sprint: Optional[str] = "Спринт 2"
    date: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = "В процессе"
    notes: Optional[str] = None
    project_id: Optional[int] = 1

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    spent: Optional[str] = None
    items_provided: Optional[str] = None
    sprint: Optional[str] = None
    date: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class CompanyResponse(CompanyBase):
    id: int
    class Config:
        from_attributes = True

# RNP Items
class RnpItemBase(BaseModel):
    project_id: Optional[int] = None
    project_name: Optional[str] = "Extragel"
    month_name: Optional[str] = "Июнь 2026"
    section: str = "visits"
    section_name: str = "Визиты и Активности"
    role: Optional[str] = None
    person: Optional[str] = None
    indicator: str
    prev_fact: Optional[str] = "0"
    prev_percent: Optional[str] = "0%"
    plan_month: Optional[str] = "0"
    fact_month: Optional[str] = "0"
    percent_month: Optional[float] = 0.0
    forecast: Optional[str] = "0"
    w1_plan: Optional[str] = "0"
    w1_fact: Optional[str] = "0"
    w2_plan: Optional[str] = "0"
    w2_fact: Optional[str] = "0"
    w3_plan: Optional[str] = "0"
    w3_fact: Optional[str] = "0"
    w4_plan: Optional[str] = "0"
    w4_fact: Optional[str] = "0"
    w5_plan: Optional[str] = "0"
    w5_fact: Optional[str] = "0"
    order: Optional[int] = 0

class RnpItemCreate(RnpItemBase):
    pass

class RnpItemUpdate(BaseModel):
    project_id: Optional[int] = None
    project_name: Optional[str] = None
    month_name: Optional[str] = None
    section: Optional[str] = None
    section_name: Optional[str] = None
    role: Optional[str] = None
    person: Optional[str] = None
    indicator: Optional[str] = None
    prev_fact: Optional[str] = None
    prev_percent: Optional[str] = None
    plan_month: Optional[str] = None
    fact_month: Optional[str] = None
    percent_month: Optional[float] = None
    forecast: Optional[str] = None
    w1_plan: Optional[str] = None
    w1_fact: Optional[str] = None
    w2_plan: Optional[str] = None
    w2_fact: Optional[str] = None
    w3_plan: Optional[str] = None
    w3_fact: Optional[str] = None
    w4_plan: Optional[str] = None
    w4_fact: Optional[str] = None
    w5_plan: Optional[str] = None
    w5_fact: Optional[str] = None
    order: Optional[int] = None

class RnpItemResponse(RnpItemBase):
    id: int
    class Config:
        from_attributes = True

# Project Tasks
class ProjectTaskBase(BaseModel):
    project_id: int
    parent_id: Optional[int] = None
    type: Optional[str] = "TASK"
    name: str
    description: Optional[str] = None
    status: Optional[str] = "Not Done"
    creator: Optional[str] = "Азамат"
    creator_initial: Optional[str] = "A"
    creator_color: Optional[str] = "bg-[#818cf8]"
    date: Optional[str] = None
    order_index: Optional[int] = 0

class ProjectTaskCreate(ProjectTaskBase):
    pass

class ProjectTaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    creator: Optional[str] = None
    creator_initial: Optional[str] = None
    creator_color: Optional[str] = None
    date: Optional[str] = None
    order_index: Optional[int] = None
    parent_id: Optional[int] = None

class ProjectTaskResponse(ProjectTaskBase):
    id: int
    children: Optional[List[Any]] = []
    class Config:
        from_attributes = True

# Dashboard Stats
class DashboardChartPoint(BaseModel):
    month: str
    fact: float
    plan: float
    factY: float
    planY: float
    x: float

class DashboardStatsResponse(BaseModel):
    total_projects: int
    total_bloggers: int
    total_companies: int
    total_members: int
    total_spent_bloggers: int
    total_spent_companies: int
    total_budget: int
    rnp_total_plan: int
    rnp_total_fact: int
    rnp_completion_rate: int
    monthly_chart: List[DashboardChartPoint]




