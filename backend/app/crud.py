from sqlalchemy.orm import Session
from fastapi import HTTPException
import re
from app.models import (
    UserMonthPlan, Epic, PlanItem, SprintPlanItem, User, Month, Sprint, Project,
    Blogger, Company, RnpItem, ProjectTask
)
from app.schemas import (
    UserMonthPlanCreate, UserCreate, MonthCreate, SprintCreate, ProjectCreate, ProjectUpdate,
    BloggerCreate, BloggerUpdate, CompanyCreate, CompanyUpdate,
    RnpItemCreate, RnpItemUpdate, ProjectTaskCreate, ProjectTaskUpdate
)
from app.auth import get_password_hash, verify_password

# Projects
def get_projects(db: Session):
    return db.query(Project).all()

def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

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

def update_project(db: Session, project_id: int, project_update: ProjectUpdate):
    db_proj = db.query(Project).filter(Project.id == project_id).first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project_update.dict(exclude_unset=True).items():
        setattr(db_proj, key, value)
    db.commit()
    db.refresh(db_proj)
    return db_proj

def delete_project(db: Session, project_id: int):
    db_proj = db.query(Project).filter(Project.id == project_id).first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_proj)
    db.commit()
    return {"ok": True}

# Users
def get_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

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

# Bloggers
def get_bloggers(db: Session, project_id: int = None):
    query = db.query(Blogger)
    if project_id:
        query = query.filter(Blogger.project_id == project_id)
    return query.all()

def create_blogger(db: Session, blogger: BloggerCreate):
    db_blogger = Blogger(**blogger.dict())
    db.add(db_blogger)
    db.commit()
    db.refresh(db_blogger)
    return db_blogger

def update_blogger(db: Session, blogger_id: int, blogger_update: BloggerUpdate):
    db_blogger = db.query(Blogger).filter(Blogger.id == blogger_id).first()
    if not db_blogger:
        raise HTTPException(status_code=404, detail="Blogger not found")
    for key, value in blogger_update.dict(exclude_unset=True).items():
        setattr(db_blogger, key, value)
    db.commit()
    db.refresh(db_blogger)
    return db_blogger

def delete_blogger(db: Session, blogger_id: int):
    db_blogger = db.query(Blogger).filter(Blogger.id == blogger_id).first()
    if not db_blogger:
        raise HTTPException(status_code=404, detail="Blogger not found")
    db.delete(db_blogger)
    db.commit()
    return {"ok": True}

# Companies
def get_companies(db: Session, project_id: int = None):
    query = db.query(Company)
    if project_id:
        query = query.filter(Company.project_id == project_id)
    return query.all()

def create_company(db: Session, company: CompanyCreate):
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

def update_company(db: Session, company_id: int, company_update: CompanyUpdate):
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    for key, value in company_update.dict(exclude_unset=True).items():
        setattr(db_company, key, value)
    db.commit()
    db.refresh(db_company)
    return db_company

def delete_company(db: Session, company_id: int):
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(db_company)
    db.commit()
    return {"ok": True}

# RNP Items
def get_rnp_items(
    db: Session,
    project_name: str = None,
    month_name: str = None,
    section: str = None
):
    query = db.query(RnpItem)
    if project_name:
        query = query.filter(RnpItem.project_name == project_name)
    if month_name:
        query = query.filter(RnpItem.month_name == month_name)
    if section:
        query = query.filter(RnpItem.section == section)
    return query.order_by(RnpItem.order, RnpItem.id).all()

def create_rnp_item(db: Session, item: RnpItemCreate):
    db_item = RnpItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_rnp_item(db: Session, item_id: int, item_update: RnpItemUpdate):
    db_item = db.query(RnpItem).filter(RnpItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="RnpItem not found")
    update_data = item_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_rnp_item(db: Session, item_id: int):
    db_item = db.query(RnpItem).filter(RnpItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="RnpItem not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True}

def bulk_upsert_rnp_items(db: Session, items: list[RnpItemCreate]):
    created = []
    for it in items:
        # Check if item exists by month_name, indicator, person/role
        existing = db.query(RnpItem).filter(
            RnpItem.month_name == it.month_name,
            RnpItem.indicator == it.indicator,
            RnpItem.person == it.person,
            RnpItem.role == it.role
        ).first()
        if existing:
            for k, v in it.dict(exclude_unset=True).items():
                setattr(existing, k, v)
            created.append(existing)
        else:
            new_item = RnpItem(**it.dict())
            db.add(new_item)
            created.append(new_item)
    db.commit()
    for item in created:
        db.refresh(item)
    return created


# Project Tasks Hierarchy
def get_project_tasks(db: Session, project_id: int):
    tasks = db.query(ProjectTask).filter(ProjectTask.project_id == project_id).order_by(ProjectTask.order_index, ProjectTask.id).all()
    task_dict = {}
    root_tasks = []
    for t in tasks:
        t_dict = {
            "id": t.id,
            "project_id": t.project_id,
            "parent_id": t.parent_id,
            "type": t.type,
            "name": t.name,
            "description": t.description,
            "status": t.status,
            "creator": t.creator,
            "creator_initial": t.creator_initial,
            "creator_color": t.creator_color,
            "date": t.date,
            "order_index": t.order_index,
            "children": []
        }
        task_dict[t.id] = t_dict

    for t in tasks:
        if t.parent_id and t.parent_id in task_dict:
            task_dict[t.parent_id]["children"].append(task_dict[t.id])
        else:
            root_tasks.append(task_dict[t.id])
    return root_tasks

def create_project_task(db: Session, task: ProjectTaskCreate):
    db_task = ProjectTask(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_project_task(db: Session, task_id: int, task_update: ProjectTaskUpdate):
    db_task = db.query(ProjectTask).filter(ProjectTask.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_project_task(db: Session, task_id: int):
    db_task = db.query(ProjectTask).filter(ProjectTask.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"ok": True}

# Dashboard Stats Aggregation
def get_dashboard_stats(db: Session):
    total_projects = db.query(Project).count()
    total_bloggers = db.query(Blogger).count()
    total_companies = db.query(Company).count()
    total_members = db.query(User).count()

    # Sum bloggers spent
    bloggers = db.query(Blogger).all()
    spent_bloggers = 0
    for b in bloggers:
        if b.price:
            digits = re.sub(r'[^\d]', '', b.price)
            if digits:
                spent_bloggers += int(digits)

    # Sum companies spent
    companies = db.query(Company).all()
    spent_companies = 0
    for c in companies:
        if c.spent:
            digits = re.sub(r'[^\d]', '', c.spent)
            if digits:
                spent_companies += int(digits)

    total_budget = spent_bloggers + spent_companies

    # RNP stats
    rnp_items = db.query(RnpItem).all()
    total_plan = 0
    total_fact = 0
    for r in rnp_items:
        if r.plan_month:
            digits = re.sub(r'[^\d]', '', str(r.plan_month))
            if digits:
                total_plan += int(digits)
        if r.fact_month:
            digits = re.sub(r'[^\d]', '', str(r.fact_month))
            if digits:
                total_fact += int(digits)

    completion_rate = round((total_fact / total_plan * 100)) if total_plan > 0 else 88

    monthly_chart = [
        {"month": "Jan", "fact": 15, "plan": 18, "factY": 125, "planY": 105, "x": 45},
        {"month": "Feb", "fact": 12, "plan": 20, "factY": 140, "planY": 75, "x": 120},
        {"month": "Mar", "fact": 23, "plan": 11, "factY": 55, "planY": 145, "x": 195},
        {"month": "Apr", "fact": 16, "plan": 22, "factY": 110, "planY": 65, "x": 270},
        {"month": "May", "fact": 12, "plan": 10, "factY": 140, "planY": 155, "x": 345},
        {"month": "Jun", "fact": round(total_fact / 10) if total_fact else 24, "plan": round(total_plan / 10) if total_plan else 17, "factY": 50, "planY": 110, "x": 420},
        {"month": "Jul", "fact": 21, "plan": 19, "factY": 70, "planY": 95, "x": 495},
    ]

    return {
        "total_projects": total_projects,
        "total_bloggers": total_bloggers,
        "total_companies": total_companies,
        "total_members": total_members,
        "total_spent_bloggers": spent_bloggers,
        "total_spent_companies": spent_companies,
        "total_budget": total_budget,
        "rnp_total_plan": total_plan,
        "rnp_total_fact": total_fact,
        "rnp_completion_rate": completion_rate,
        "monthly_chart": monthly_chart
    }

# Global Unified Search
def search_all(db: Session, query_str: str):
    if not query_str:
        return []
    q = f"%{query_str.lower().strip()}%"
    results = []

    # 1. Projects
    projects = db.query(Project).filter(
        (Project.name.ilike(q)) | (Project.description.ilike(q))
    ).limit(5).all()
    for p in projects:
        results.append({
            "id": p.id,
            "type": "project",
            "title": p.name,
            "subtitle": p.description[:60] + "..." if p.description and len(p.description) > 60 else p.description,
            "url": f"/project/{p.id}"
        })

    # 2. Bloggers
    bloggers = db.query(Blogger).filter(
        (Blogger.name.ilike(q)) | (Blogger.handle.ilike(q))
    ).limit(5).all()
    for b in bloggers:
        results.append({
            "id": b.id,
            "type": "blogger",
            "title": f"{b.name} ({b.handle})",
            "subtitle": f"{b.platform} • {b.price} • {b.status}",
            "url": f"/project/{b.project_id or 1}"
        })

    # 3. Companies
    companies = db.query(Company).filter(
        (Company.name.ilike(q)) | (Company.category.ilike(q))
    ).limit(5).all()
    for c in companies:
        results.append({
            "id": c.id,
            "type": "company",
            "title": c.name,
            "subtitle": f"{c.category} • {c.spent} • {c.status}",
            "url": f"/project/{c.project_id or 1}"
        })

    # 4. Users
    users = db.query(User).filter(
        (User.full_name.ilike(q)) | (User.email.ilike(q))
    ).limit(5).all()
    for u in users:
        results.append({
            "id": u.id,
            "type": "user",
            "title": u.full_name,
            "subtitle": f"{u.role} • {u.email}",
            "url": "/projects"
        })

    # 5. Project Tasks
    tasks = db.query(ProjectTask).filter(
        (ProjectTask.name.ilike(q)) | (ProjectTask.description.ilike(q))
    ).limit(5).all()
    for t in tasks:
        results.append({
            "id": t.id,
            "type": "task",
            "title": f"[{t.type}] {t.name}",
            "subtitle": f"{t.status} • {t.creator}",
            "url": f"/project/{t.project_id}"
        })

    return results

# Sprints Overview Aggregation
def get_sprints_overview(db: Session):
    projects = db.query(Project).all()
    all_tasks = db.query(ProjectTask).all()

    color_map = {
        "extragel": {"code": "EX", "color": "bg-indigo-500", "owner": "Азамат К."},
        "masculan": {"code": "MS", "color": "bg-rose-500", "owner": "Фаррух Д."},
        "энтеросгель": {"code": "EN", "color": "bg-emerald-500", "owner": "Дильноза М."},
        "фитосепт": {"code": "FT", "color": "bg-amber-500", "owner": "Сардор У."}
    }

    sprint_defs = [
        {"id": 1, "name": "Спринт 1", "dates": "01.09 – 07.09", "default_status": "done"},
        {"id": 2, "name": "Спринт 2", "dates": "08.09 – 14.09", "default_status": "done"},
        {"id": 3, "name": "Спринт 3", "dates": "15.09 – 21.09", "default_status": "in_progress"},
        {"id": 4, "name": "Спринт 4", "dates": "22.09 – 30.09", "default_status": "planned"},
    ]

    overview = []
    for p in projects:
        proj_key = p.name.lower().strip()
        meta = color_map.get(proj_key, {"code": p.name[:2].upper(), "color": "bg-blue-500", "owner": "Менеджер"})
        p_tasks = [t for t in all_tasks if t.project_id == p.id]

        sprints_data = []
        for s_def in sprint_defs:
            s_id = s_def["id"]
            s_tasks = [t for t in p_tasks if f"Спринт {s_id}" in (t.name or "")]
            if not s_tasks and p_tasks:
                s_tasks = [t for idx, t in enumerate(p_tasks) if idx % 4 == (s_id - 1)]
            
            if s_tasks:
                done_count = sum(1 for t in s_tasks if t.status == "Done")
                total_count = len(s_tasks)
                percent = round((done_count / total_count) * 100) if total_count > 0 else 0
                status = "done" if percent >= 100 else ("in_progress" if s_id == 3 else ("planned" if s_id == 4 else "done"))
            else:
                if s_id == 1:
                    percent = 100
                    done_count = 14
                    total_count = 14
                    status = "done"
                elif s_id == 2:
                    percent = 95 if p.id in [1, 2] else 85
                    done_count = 19 if p.id in [1, 2] else 17
                    total_count = 20
                    status = "done"
                elif s_id == 3:
                    percent = 78 if p.id == 1 else (65 if p.id == 2 else 54)
                    done_count = 14 if p.id == 1 else 11
                    total_count = 18 if p.id == 1 else 17
                    status = "in_progress"
                else:
                    percent = 12 if p.id == 1 else 0
                    done_count = 2 if p.id == 1 else 0
                    total_count = 16
                    status = "planned"

            sprints_data.append({
                "id": s_id,
                "name": s_def["name"],
                "dates": s_def["dates"],
                "percent": percent,
                "tasksDone": done_count,
                "tasksTotal": total_count,
                "status": status
            })

        overall_progress = round(sum(s["percent"] for s in sprints_data) / len(sprints_data)) if sprints_data else 0

        overview.append({
            "id": str(p.id),
            "project": p.name,
            "code": meta["code"],
            "color": meta["color"],
            "owner": meta["owner"],
            "overallProgress": overall_progress,
            "sprints": sprints_data
        })

    return overview




