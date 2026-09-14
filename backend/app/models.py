from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Enum, Float
from sqlalchemy.orm import relationship, backref
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


class Blogger(Base):
    __tablename__ = "bloggers"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    name = Column(String, index=True)
    handle = Column(String, index=True)
    platform = Column(String, default="Instagram")
    followers = Column(String, default="100K")
    reach = Column(String, default="20K")
    views = Column(Integer, default=0)
    format = Column(String, default="Reels + 2 Stories")
    price = Column(String, default="$250")
    status = Column(String, default="Переговоры")
    publish_date = Column(String, nullable=True)
    sprint = Column(String, default="Спринт 2")
    profile_url = Column(String, nullable=True)
    post_url = Column(String, nullable=True)
    manager_contact = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)
    profile_visits = Column(Integer, default=0)
    link_clicks = Column(Integer, default=0)

    project = relationship("Project")


class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    name = Column(String, index=True)
    category = Column(String, default="Гостиница / Отель")
    location = Column(String, nullable=True)
    spent = Column(String, default="$500")
    items_provided = Column(String, nullable=True)
    sprint = Column(String, default="Спринт 2")
    date = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    status = Column(String, default="В процессе")
    notes = Column(String, nullable=True)

    project = relationship("Project")


class RnpItem(Base):
    __tablename__ = "rnp_items"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    project_name = Column(String, default="Extragel", index=True)
    month_name = Column(String, default="Июнь 2026", index=True)
    section = Column(String, default="visits", index=True)
    section_name = Column(String, default="Визиты и Активности")
    role = Column(String, nullable=True)
    person = Column(String, nullable=True)
    indicator = Column(String, nullable=False)
    prev_fact = Column(String, default="0")
    prev_percent = Column(String, default="0%")
    plan_month = Column(String, default="0")
    fact_month = Column(String, default="0")
    percent_month = Column(Float, default=0.0)
    forecast = Column(String, default="0")
    w1_plan = Column(String, default="0")
    w1_fact = Column(String, default="0")
    w2_plan = Column(String, default="0")
    w2_fact = Column(String, default="0")
    w3_plan = Column(String, default="0")
    w3_fact = Column(String, default="0")
    w4_plan = Column(String, default="0")
    w4_fact = Column(String, default="0")
    w5_plan = Column(String, default="0")
    w5_fact = Column(String, default="0")
    order = Column(Integer, default=0)

    project = relationship("Project")


class ProjectTask(Base):
    __tablename__ = "project_tasks"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(Integer, ForeignKey("project_tasks.id", ondelete="CASCADE"), nullable=True, index=True)
    type = Column(String, default="TASK")  # EPIC, SPRINT, DAILY, TASK
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="Not Done")  # Not Done, In Progress, Done
    creator = Column(String, default="Азамат")
    creator_initial = Column(String, default="A")
    creator_color = Column(String, default="bg-[#818cf8]")
    date = Column(String, nullable=True)
    order_index = Column(Integer, default=0)

    project = relationship("Project")
    children = relationship("ProjectTask", cascade="all, delete-orphan", backref=backref("parent", remote_side=[id]), order_by="ProjectTask.order_index")
