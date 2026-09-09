from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Enum, Float
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class RoleEnum(str, enum.Enum):
    employee = "employee"
    manager = "manager"
    admin = "admin"
    super_admin = "super_admin"

class StatusEnum(str, enum.Enum):
    not_done = "Not Done"
    in_progress = "In Progress"
    done = "Done"

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    
class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    users = relationship("User", back_populates="team")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.employee)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    team = relationship("Team", back_populates="users")
    month_plans = relationship("UserMonthPlan", back_populates="user")

class Month(Base):
    __tablename__ = "months"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g. "Сентябрь 2026"
    start_date = Column(Date)
    end_date = Column(Date)
    
    sprints = relationship("Sprint", back_populates="month", cascade="all, delete")

class Sprint(Base):
    __tablename__ = "sprints"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g. "Sprint 1"
    start_date = Column(Date)
    end_date = Column(Date)
    month_id = Column(Integer, ForeignKey("months.id"))
    
    month = relationship("Month", back_populates="sprints")

class UserMonthPlan(Base):
    __tablename__ = "user_month_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month_id = Column(Integer, ForeignKey("months.id"))
    
    user = relationship("User", back_populates="month_plans")
    month = relationship("Month")
    epics = relationship("Epic", back_populates="user_month_plan", cascade="all, delete")

class Epic(Base):
    __tablename__ = "epics"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    user_month_plan_id = Column(Integer, ForeignKey("user_month_plans.id"))
    
    user_month_plan = relationship("UserMonthPlan", back_populates="epics")
    plan_items = relationship("PlanItem", back_populates="epic", cascade="all, delete")

class PlanItem(Base):
    __tablename__ = "plan_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    month_plan = Column(Float, default=0)
    epic_id = Column(Integer, ForeignKey("epics.id"))
    
    epic = relationship("Epic", back_populates="plan_items")
    sprint_items = relationship("SprintPlanItem", back_populates="plan_item", cascade="all, delete")

class SprintPlanItem(Base):
    __tablename__ = "sprint_plan_items"
    id = Column(Integer, primary_key=True, index=True)
    plan_item_id = Column(Integer, ForeignKey("plan_items.id"))
    sprint_id = Column(Integer, ForeignKey("sprints.id"))
    sprint_plan = Column(Float, default=0)
    sprint_fact = Column(Float, default=0)
    status = Column(Enum(StatusEnum), default=StatusEnum.not_done)
    
    plan_item = relationship("PlanItem", back_populates="sprint_items")
    sprint = relationship("Sprint")

