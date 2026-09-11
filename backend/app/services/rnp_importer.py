import csv
import io
import re
from typing import List, Optional
from app.schemas import RnpItemCreate

def clean_val(val: Optional[str]) -> str:
    if not val:
        return "0"
    v = val.strip()
    if v in ["#REF!", "#VALUE!", "-", ""]:
        return "0"
    return v

def clean_percent(val: Optional[str]) -> float:
    if not val:
        return 0.0
    v = val.strip().replace("%", "").replace(",", ".")
    if v in ["#REF!", "#VALUE!", "-", ""]:
        return 0.0
    try:
        return round(float(v), 2)
    except ValueError:
        return 0.0

def parse_rnp_csv(csv_content: str, project_name: str = "Extragel", month_name: str = "Июнь 2026") -> List[RnpItemCreate]:
    reader = csv.reader(io.StringIO(csv_content))
    items: List[RnpItemCreate] = []

    current_section = "visits"
    current_section_name = "Визиты и Активности"
    current_role = None
    current_person = None
    order = 0

    for row in reader:
        if not row:
            continue
        # Pad row to at least 20 columns
        row = [col.strip() for col in row] + [""] * max(0, 20 - len(row))

        col0 = row[0]
        col1 = row[1]
        col2 = row[2]

        # Detect headers / metadata to skip
        if any(h in col0 for h in ["Норма Врач", "Норма Апт", "Раб дней", "Допродаж"]) or "РНП приложение" in col2:
            continue
        if "Факт Прошлый месяц" in row[3]:
            continue

        # Detect Section boundaries
        if "Визиты и Активности" in col0:
            current_section = "visits"
            current_section_name = "Визиты и Активности"
            current_role = None
            current_person = None
        elif "Рецепты" in col0 and "кол-во" not in col2 and not col1:
            current_section = "prescriptions"
            current_section_name = "Рецепты и Назначения"
            current_role = None
            current_person = None
        elif any(k in col0 for k in ["КОМ ДИР", "Ташкент РТ", "МП Ташкент", "МП Самарканд", "МП Фергана", "МП Андижан"]):
            current_section = "reps"
            current_section_name = "Медицинские представители и РТ"
            current_role = col0
            if col1:
                current_person = col1
        elif "Мерчендайзеры" in col0 or "FMCG" in col2:
            current_section = "merch"
            current_section_name = "Мерчендайзинг и FMCG"
            if col0:
                current_role = col0
            if col1:
                current_person = col1
        elif "Онлайн продажи" in col0 or "Uzum" in col2 or "Яндекс" in col2:
            current_section = "ecommerce"
            current_section_name = "E-Commerce и Онлайн Продажи"
            if col0:
                current_role = col0
            if col1:
                current_person = col1
        elif "Муллаханова" in col0 or "SMM" in col1 or "СММ" in col1 or "Yumearth" in col1:
            current_section = "smm"
            current_section_name = "SMM и Инфлюенс-Маркетинг"
            if col0:
                current_person = col0
            if col1:
                current_role = col1
        elif "Акции СТМ" in col0 or "Маркетинг" in col0:
            current_section = "promo"
            current_section_name = "Маркетинг и B2B Акции"
            if col0:
                current_role = col0
            if col1:
                current_person = col1

        # Check if this row is an indicator row
        indicator = col2 if col2 else col1
        if not indicator or indicator in ["SMM", "неделя", "2"]:
            continue

        # Skip rows that are completely empty of numbers
        if not any(row[3:10]):
            continue

        order += 1
        item = RnpItemCreate(
            project_name=project_name,
            month_name=month_name,
            section=current_section,
            section_name=current_section_name,
            role=current_role if current_role else None,
            person=current_person if current_person else None,
            indicator=indicator,
            prev_fact=clean_val(row[3]),
            prev_percent=clean_val(row[4]),
            plan_month=clean_val(row[5]),
            fact_month=clean_val(row[6]),
            percent_month=clean_percent(row[7]),
            forecast=clean_val(row[8]),
            w1_plan=clean_val(row[10]),
            w1_fact=clean_val(row[11]),
            w2_plan=clean_val(row[12]),
            w2_fact=clean_val(row[13]),
            w3_plan=clean_val(row[14]),
            w3_fact=clean_val(row[15]),
            w4_plan=clean_val(row[16]),
            w4_fact=clean_val(row[17]),
            w5_plan=clean_val(row[18]),
            w5_fact=clean_val(row[19]),
            order=order
        )
        items.append(item)

    return items
