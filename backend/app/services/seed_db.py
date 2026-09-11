import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models
from app.auth import get_password_hash
from app.services.rnp_importer import parse_rnp_csv
import os

def seed_all():
    db: Session = SessionLocal()
    try:
        print("--- Starting Database Seeding ---")

        # 1. Projects
        projects_data = [
            {
                "id": 1,
                "name": "Extragel",
                "description": "Продвижение и продажи противовоспалительного и обезболивающего геля Extragel. Работа с ЛПУ, врачами и ключевыми аптеками Узбекистана.",
                "start_date": datetime.date(2026, 6, 1),
                "end_date": datetime.date(2026, 12, 31),
            },
            {
                "id": 2,
                "name": "Masculan",
                "description": "Барьерная контрацепция немецкого качества Masculan. Дистрибуция в рознице, аптеках, FMCG и молодежный SMM маркетинг.",
                "start_date": datetime.date(2026, 6, 1),
                "end_date": datetime.date(2026, 12, 31),
            },
            {
                "id": 3,
                "name": "Энтеросгель",
                "description": "Флагманский энтеросорбент Энтеросгель. Фармкружки в аптечных сетях 36.6/Oxymed, работа с педиатрами и аллергологами.",
                "start_date": datetime.date(2026, 6, 1),
                "end_date": datetime.date(2026, 12, 31),
            },
            {
                "id": 4,
                "name": "Фитосепт",
                "description": "Антисептические препараты, пастилки и спреи Фитосепт. Сезонные промо-акции и мерчендайзинг первой линии.",
                "start_date": datetime.date(2026, 6, 1),
                "end_date": datetime.date(2026, 12, 31),
            }
        ]

        for p_data in projects_data:
            existing = db.query(models.Project).filter(models.Project.id == p_data["id"]).first()
            if not existing:
                proj = models.Project(**p_data)
                db.add(proj)
            else:
                for k, v in p_data.items():
                    setattr(existing, k, v)
        db.commit()
        print(f"Projects seeded: {len(projects_data)}")

        # 2. Teams
        teams_data = [
            {"id": 1, "name": "Руководство и Коммерческий Департамент"},
            {"id": 2, "name": "Медицинские представители (Ташкент)"},
            {"id": 3, "name": "Медицинские представители (Регионы)"},
            {"id": 4, "name": "E-Commerce и Онлайн-продажи"},
            {"id": 5, "name": "Маркетинг, PR и SMM"},
            {"id": 6, "name": "Мерчендайзинг и FMCG"},
        ]
        for t_data in teams_data:
            existing = db.query(models.Team).filter(models.Team.id == t_data["id"]).first()
            if not existing:
                t = models.Team(**t_data)
                db.add(t)
            else:
                existing.name = t_data["name"]
        db.commit()
        print(f"Teams seeded: {len(teams_data)}")

        # 3. Users
        default_pwd = get_password_hash("password")
        users_data = [
            {"email": "admin@extragel.uz", "full_name": "Азамат (Администратор)", "role": models.RoleEnum.admin, "team_id": 1},
            {"email": "grinkevich@extragel.uz", "full_name": "Гринкевич Святослав (РТ)", "role": models.RoleEnum.manager, "team_id": 2},
            {"email": "durdon@extragel.uz", "full_name": "Абдукабирова Дурдона (МП)", "role": models.RoleEnum.employee, "team_id": 2},
            {"email": "dzhamshid@extragel.uz", "full_name": "Жумобоев Джамшид (МП)", "role": models.RoleEnum.employee, "team_id": 2},
            {"email": "humor@extragel.uz", "full_name": "Назарова Хумор (МП Самарканд)", "role": models.RoleEnum.employee, "team_id": 3},
            {"email": "habibulloh@extragel.uz", "full_name": "Рахманов Хабибуллох (E-Com)", "role": models.RoleEnum.manager, "team_id": 4},
            {"email": "samira@extragel.uz", "full_name": "Муллаханова Самира (SMM)", "role": models.RoleEnum.employee, "team_id": 5},
            {"email": "nargis@extragel.uz", "full_name": "Мамутова Наргис (Мерчендайзинг)", "role": models.RoleEnum.employee, "team_id": 6},
        ]
        for u_data in users_data:
            existing = db.query(models.User).filter(models.User.email == u_data["email"]).first()
            if not existing:
                u = models.User(**u_data, hashed_password=default_pwd)
                db.add(u)
            else:
                for k, v in u_data.items():
                    setattr(existing, k, v)
        db.commit()
        print(f"Users seeded: {len(users_data)}")

        # 4. Months & Sprints
        months_data = [
            {
                "id": 1,
                "name": "Июнь 2026",
                "start_date": datetime.date(2026, 6, 1),
                "end_date": datetime.date(2026, 6, 30),
                "sprints": [
                    {"name": "Спринт 1", "start_date": datetime.date(2026, 6, 1), "end_date": datetime.date(2026, 6, 7)},
                    {"name": "Спринт 2", "start_date": datetime.date(2026, 6, 8), "end_date": datetime.date(2026, 6, 14)},
                    {"name": "Спринт 3", "start_date": datetime.date(2026, 6, 15), "end_date": datetime.date(2026, 6, 21)},
                    {"name": "Спринт 4", "start_date": datetime.date(2026, 6, 22), "end_date": datetime.date(2026, 6, 28)},
                    {"name": "Спринт 5", "start_date": datetime.date(2026, 6, 29), "end_date": datetime.date(2026, 6, 30)},
                ]
            },
            {
                "id": 2,
                "name": "Сентябрь 2026",
                "start_date": datetime.date(2026, 9, 1),
                "end_date": datetime.date(2026, 9, 30),
                "sprints": [
                    {"name": "Спринт 1", "start_date": datetime.date(2026, 9, 1), "end_date": datetime.date(2026, 9, 7)},
                    {"name": "Спринт 2", "start_date": datetime.date(2026, 9, 8), "end_date": datetime.date(2026, 9, 14)},
                    {"name": "Спринт 3", "start_date": datetime.date(2026, 9, 15), "end_date": datetime.date(2026, 9, 21)},
                    {"name": "Спринт 4", "start_date": datetime.date(2026, 9, 22), "end_date": datetime.date(2026, 9, 30)},
                ]
            }
        ]

        for m_data in months_data:
            existing_m = db.query(models.Month).filter(models.Month.id == m_data["id"]).first()
            if not existing_m:
                m = models.Month(id=m_data["id"], name=m_data["name"], start_date=m_data["start_date"], end_date=m_data["end_date"])
                db.add(m)
                db.commit()
                db.refresh(m)
                for sp in m_data["sprints"]:
                    s = models.Sprint(name=sp["name"], start_date=sp["start_date"], end_date=sp["end_date"], month_id=m.id)
                    db.add(s)
                db.commit()
        print("Months and Sprints seeded.")

        # 5. User Month Plans, Epics, PlanItems, SprintPlanItems
        admin_user = db.query(models.User).filter(models.User.email == "admin@extragel.uz").first()
        june_month = db.query(models.Month).filter(models.Month.name == "Июнь 2026").first()
        if admin_user and june_month:
            existing_plan = db.query(models.UserMonthPlan).filter(
                models.UserMonthPlan.user_id == admin_user.id,
                models.UserMonthPlan.month_id == june_month.id
            ).first()
            if not existing_plan:
                plan = models.UserMonthPlan(user_id=admin_user.id, month_id=june_month.id)
                db.add(plan)
                db.commit()
                db.refresh(plan)

                # Epic 1: Визитная активность
                epic1 = models.Epic(name="Полевая визитная активность", user_month_plan_id=plan.id)
                db.add(epic1)
                db.commit()
                db.refresh(epic1)

                pi1 = models.PlanItem(name="Визиты аптечные Ташкент", month_plan=676, epic_id=epic1.id)
                pi2 = models.PlanItem(name="Визиты врачебные личные", month_plan=1120, epic_id=epic1.id)
                db.add_all([pi1, pi2])
                db.commit()

                june_sprints = db.query(models.Sprint).filter(models.Sprint.month_id == june_month.id).order_by(models.Sprint.id).all()
                if len(june_sprints) >= 5:
                    spi_plans1 = [150, 108, 144, 184, 90]
                    spi_facts1 = [164, 108, 132, 184, 0]
                    for idx, sp in enumerate(june_sprints[:5]):
                        spi = models.SprintPlanItem(
                            plan_item_id=pi1.id,
                            sprint_id=sp.id,
                            sprint_plan=spi_plans1[idx],
                            sprint_fact=spi_facts1[idx],
                            status=models.StatusEnum.done if spi_facts1[idx] >= spi_plans1[idx] and spi_facts1[idx] > 0 else (models.StatusEnum.in_progress if spi_facts1[idx] > 0 else models.StatusEnum.not_done)
                        )
                        db.add(spi)

                    spi_plans2 = [250, 180, 240, 300, 150]
                    spi_facts2 = [256, 180, 220, 300, 0]
                    for idx, sp in enumerate(june_sprints[:5]):
                        spi = models.SprintPlanItem(
                            plan_item_id=pi2.id,
                            sprint_id=sp.id,
                            sprint_plan=spi_plans2[idx],
                            sprint_fact=spi_facts2[idx],
                            status=models.StatusEnum.done if spi_facts2[idx] >= spi_plans2[idx] and spi_facts2[idx] > 0 else (models.StatusEnum.in_progress if spi_facts2[idx] > 0 else models.StatusEnum.not_done)
                        )
                        db.add(spi)
                    db.commit()
                print("Operational plans, epics and sprint items seeded.")

        # 6. Bloggers (Realistic influencer marketing dataset)
        bloggers_data = [
            {
                "id": 1,
                "project_id": 1,
                "name": "Шахзода Мухаммедова",
                "handle": "@shakhzoda__mukhammedova",
                "platform": "Instagram",
                "followers": "4.2M",
                "reach": "180K",
                "views": 148200,
                "format": "Reels + 2 Stories",
                "price": "$650",
                "status": "Вышел пост",
                "publish_date": "18.06.2026",
                "sprint": "Спринт 3",
                "profile_url": "https://instagram.com/shakhzoda__mukhammedova",
                "post_url": "https://instagram.com/p/example1",
                "manager_contact": "Дилором (агент): +998 90 123 45 67",
                "notes": "Интеграция Extragel: активный образ жизни и быстрое снятие мышечной боли.",
                "likes": 12400,
                "comments": 480,
                "shares": 1920,
                "saves": 3180,
                "profile_visits": 3950,
                "link_clicks": 820
            },
            {
                "id": 2,
                "project_id": 1,
                "name": "Доктор Алимов (Health & Life)",
                "handle": "@dr_alimov_health",
                "platform": "Telegram",
                "followers": "120K",
                "reach": "45K",
                "views": 42000,
                "format": "Экспертный пост с опросом",
                "price": "$200",
                "status": "Оплачено",
                "publish_date": "20.06.2026",
                "sprint": "Спринт 3",
                "profile_url": "https://t.me/dr_alimov_health",
                "manager_contact": "Личный контакт: +998 93 500 11 22",
                "notes": "Медицинский разбор состава геля и показаний при артрозах и растяжениях.",
                "likes": 2100,
                "comments": 190,
                "shares": 850,
                "saves": 940,
                "profile_visits": 1120,
                "link_clicks": 340
            },
            {
                "id": 3,
                "project_id": 2,
                "name": "Мадина Мамасидикова",
                "handle": "@madina_lifestyle",
                "platform": "Instagram",
                "followers": "850K",
                "reach": "95K",
                "views": 88500,
                "format": "Stories распаковка аптечки",
                "price": "$300",
                "status": "Согласовано",
                "publish_date": "22.06.2026",
                "sprint": "Спринт 4",
                "profile_url": "https://instagram.com/madina_lifestyle",
                "manager_contact": "+998 97 777 88 99",
                "notes": "Направление Masculan & Extragel: стиль жизни, спорт, безопасность.",
                "likes": 6800,
                "comments": 220,
                "shares": 540,
                "saves": 1420,
                "profile_visits": 1840,
                "link_clicks": 410
            },
            {
                "id": 4,
                "project_id": 1,
                "name": "Фитнес Ташкент (Артём)",
                "handle": "@tashkent_fit_artem",
                "platform": "TikTok",
                "followers": "340K",
                "reach": "110K",
                "views": 102000,
                "format": "Динамичный ролик тренировки",
                "price": "$180",
                "status": "Съемка контента",
                "publish_date": "24.06.2026",
                "sprint": "Спринт 4",
                "profile_url": "https://tiktok.com/@tashkent_fit_artem",
                "notes": "Демонстрация восстановления связок и мышц после кроссфита.",
                "likes": 15400,
                "comments": 310,
                "shares": 1200,
                "saves": 2800,
                "profile_visits": 2400,
                "link_clicks": 560
            },
            {
                "id": 5,
                "project_id": 3,
                "name": "Муниса Ризаева",
                "handle": "@munisarizaeva",
                "platform": "Instagram",
                "followers": "6.1M",
                "reach": "320K",
                "views": 290000,
                "format": "Reels + Интеграция в Stories",
                "price": "$1,200",
                "status": "Вышел пост",
                "publish_date": "15.06.2026",
                "sprint": "Спринт 3",
                "profile_url": "https://instagram.com/munisarizaeva",
                "notes": "Энтеросгель: чистая кожа, здоровье ЖКТ и детокс в путешествиях.",
                "likes": 28900,
                "comments": 890,
                "shares": 3400,
                "saves": 6500,
                "profile_visits": 7800,
                "link_clicks": 1650
            },
            {
                "id": 6,
                "project_id": 3,
                "name": "Доктор Шахноза (Педиатр)",
                "handle": "@dr_shakhnoza_pediatr",
                "platform": "Instagram",
                "followers": "210K",
                "reach": "65K",
                "views": 61000,
                "format": "Экспертный Reels",
                "price": "$250",
                "status": "Оплачено",
                "publish_date": "17.06.2026",
                "sprint": "Спринт 3",
                "profile_url": "https://instagram.com/dr_shakhnoza_pediatr",
                "notes": "Энтеросгель в детской практике: отравления, аллергии и ротавирус.",
                "likes": 4200,
                "comments": 410,
                "shares": 1600,
                "saves": 2900,
                "profile_visits": 2100,
                "link_clicks": 690
            }
        ]

        for b_data in bloggers_data:
            existing_b = db.query(models.Blogger).filter(models.Blogger.id == b_data["id"]).first()
            if not existing_b:
                b = models.Blogger(**b_data)
                db.add(b)
            else:
                for k, v in b_data.items():
                    setattr(existing_b, k, v)
        db.commit()
        print(f"Bloggers seeded: {len(bloggers_data)}")

        # 7. Companies (B2B Partners, Hotels, Clinic networks)
        companies_data = [
            {
                "id": 1,
                "project_id": 1,
                "name": "Hilton Tashkent City",
                "category": "Гостиница / Отель",
                "location": "г. Ташкент, ул. И. Каримова, 2",
                "spent": "$500",
                "items_provided": "Welcome-наборы VIP (200 шт.), брендированные саше Extragel в спа-комплекс",
                "sprint": "Спринт 2",
                "date": "10.06.2026",
                "contact_person": "Фаррух Каримов (Supply Manager)",
                "phone": "+998 71 200 45 45",
                "status": "Передано",
                "notes": "Материалы переданы в зону СПА и на ресепшен. Получен акт приема-передачи."
            },
            {
                "id": 2,
                "project_id": 2,
                "name": "Hyatt Regency Tashkent",
                "category": "Гостиница / Отель",
                "location": "г. Ташкент, ул. Навои, 1",
                "spent": "$350",
                "items_provided": "Премиум-боксы Masculan (150 шт.), саше в ванные комнаты",
                "sprint": "Спринт 2",
                "date": "12.06.2026",
                "contact_person": "Нодира (Guest Relations)",
                "phone": "+998 71 207 12 34",
                "status": "В процессе",
                "notes": "Согласован пилотный запуск в 50 номерах категории Deluxe."
            },
            {
                "id": 3,
                "project_id": 3,
                "name": "Сеть аптек Oxymed (110 точек)",
                "category": "Аптечная сеть",
                "location": "г. Ташкент и регионы РУз",
                "spent": "$800",
                "items_provided": "Фирменные торцевые стойки, вобблеры, стопперы 'Энтеросгель #1'",
                "sprint": "Спринт 1",
                "date": "05.06.2026",
                "contact_person": "Бахтиёр (Маркетинг Oxymed)",
                "phone": "+998 90 999 10 20",
                "status": "Завершено",
                "notes": "Полная выкладка в прикассовой зоне 80 аптек в Ташкенте и 30 в регионах."
            },
            {
                "id": 4,
                "project_id": 1,
                "name": "Сеть аптек 36.6 (Ташкент)",
                "category": "Аптечная сеть",
                "location": "г. Ташкент, 45 филиалов",
                "spent": "$450",
                "items_provided": "Дисплеи Extragel на первой линии, обучающие материалы для фармацевтов",
                "sprint": "Спринт 3",
                "date": "16.06.2026",
                "contact_person": "Гульноза (Категорийный менеджер)",
                "phone": "+998 93 180 55 66",
                "status": "В процессе",
                "notes": "Проводятся фармкружки среди первостольников."
            },
            {
                "id": 5,
                "project_id": 1,
                "name": "Медицинский центр Akfa Medline",
                "category": "Клиника / Медцентр",
                "location": "г. Ташкент, Алмазарский район",
                "spent": "$600",
                "items_provided": "Информационные стойки, брошюры для ортопедов и неврологов",
                "sprint": "Спринт 2",
                "date": "11.06.2026",
                "contact_person": "Д-р Тимур Рустамович",
                "phone": "+998 71 203 30 03",
                "status": "Завершено",
                "notes": "Проведена презентация для 24 врачей отделения травматологии и реабилитации."
            },
            {
                "id": 6,
                "project_id": 2,
                "name": "Сеть фитнес-клубов Buka Gym",
                "category": "Спортивный клуб",
                "location": "г. Ташкент (3 клуба)",
                "spent": "$300",
                "items_provided": "Спортивные полотенца, промо-стенды в фитнес-барах",
                "sprint": "Спринт 3",
                "date": "19.06.2026",
                "contact_person": "Жасур (Управляющий)",
                "phone": "+998 90 333 44 55",
                "status": "Согласовано",
                "notes": "Брендирование зон кроссфита и бокса."
            }
        ]

        for c_data in companies_data:
            existing_c = db.query(models.Company).filter(models.Company.id == c_data["id"]).first()
            if not existing_c:
                c = models.Company(**c_data)
                db.add(c)
            else:
                for k, v in c_data.items():
                    setattr(existing_c, k, v)
        db.commit()
        print(f"Companies seeded: {len(companies_data)}")

        # 8. RnpItems (from CSV if needed)
        csv_path = "app/data/rnp_june_2026.csv"
        if os.path.exists(csv_path):
            with open(csv_path, "r", encoding="utf-8") as f:
                parsed = parse_rnp_csv(f.read(), project_name="Extragel", month_name="Июнь 2026")
                from app import crud
                crud.bulk_upsert_rnp_items(db=db, items=parsed)
                print(f"RNP items confirmed in DB: {len(parsed)}")

        print("--- Database Seeding Completed Successfully! ---")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()
