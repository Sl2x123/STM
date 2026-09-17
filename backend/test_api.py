#!/usr/bin/env python3
"""
Automated Backend API Verification Suite for PMS System.
Tests all endpoints: Auth, Dashboard, Projects, Tasks, Sprints, Bloggers, RNP, Search, and Telegram.
"""
import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000"

def request(method: str, path: str, data: dict = None, token: str = None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            res_body = res.read().decode("utf-8")
            parsed = json.loads(res_body) if res_body else {}
            return res.status, parsed
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            parsed_err = json.loads(err_body)
        except Exception:
            parsed_err = {"raw": err_body}
        return e.code, parsed_err

def run_tests():
    passed = 0
    failed = 0
    total = 0

    def check(title: str, condition: bool, details: str = ""):
        nonlocal passed, failed, total
        total += 1
        if condition:
            passed += 1
            print(f"  ✅ [PASS] {title}")
        else:
            failed += 1
            print(f"  ❌ [FAIL] {title}: {details}")

    print("\n🔍 ================== PMS BACKEND TEST SUITE ==================\n")

    # 1. API Root
    print("👉 1. Base Connectivity")
    code, res = request("GET", "/")
    check("API Root (GET /) returns 200", code == 200 and "message" in res, f"code={code}")

    # 2. Auth for all 3 roles
    print("\n👉 2. Authentication & Roles (RBAC)")
    # 2a. Admin login
    code, res_admin = request("POST", "/api/v1/auth/login", {"email": "admin@extragel.uz", "password": "password"})
    admin_token = res_admin.get("access_token")
    check("Admin login (POST /auth/login) returns JWT", code == 200 and bool(admin_token), f"res={res_admin}")
    check("Admin user role is 'admin'", res_admin.get("user", {}).get("role") == "admin")

    # 2b. Manager login
    code, res_mgr = request("POST", "/api/v1/auth/login", {"email": "manager@extragel.uz", "password": "password"})
    check("Manager login returns JWT with role 'manager'", code == 200 and res_mgr.get("user", {}).get("role") == "manager")

    # 2c. Employee login
    code, res_emp = request("POST", "/api/v1/auth/login", {"email": "employee@extragel.uz", "password": "password"})
    check("Employee login returns JWT with role 'employee'", code == 200 and res_emp.get("user", {}).get("role") == "employee")

    # 2d. Auth /me endpoint
    code, me_res = request("GET", "/api/v1/auth/me", token=admin_token)
    check("Current user (GET /auth/me) with token", code == 200 and me_res.get("email") == "admin@extragel.uz")

    # 3. Dashboard Stats
    print("\n👉 3. Dashboard Stats Aggregation")
    code, stats = request("GET", "/api/v1/dashboard/stats")
    check("Dashboard stats (GET /dashboard/stats) status 200", code == 200)
    check("Stats contains total_projects >= 1", stats.get("total_projects", 0) >= 1)
    check("Stats contains total_budget number", isinstance(stats.get("total_budget"), (int, float)))
    check("Stats contains rnp_completion_rate", "rnp_completion_rate" in stats)
    check("Stats contains monthly_chart list", isinstance(stats.get("monthly_chart"), list) and len(stats["monthly_chart"]) > 0)

    # 4. Projects & Tasks Hierarchy
    print("\n👉 4. Projects & Tasks Tree")
    code, projects = request("GET", "/api/v1/projects/")
    check("Projects list (GET /projects/) status 200", code == 200 and isinstance(projects, list))
    check("At least one project in DB", len(projects) >= 1)

    first_proj_id = projects[0]["id"] if projects else 1
    code, tasks = request("GET", f"/api/v1/projects/{first_proj_id}/tasks")
    check(f"Project tasks hierarchy (GET /projects/{first_proj_id}/tasks) status 200", code == 200 and isinstance(tasks, list))

    # 5. Sprints Overview Matrix
    print("\n👉 5. Sprints Overview for Reports")
    code, sprints_overview = request("GET", "/api/v1/reports/sprints-overview")
    check("Sprints overview (GET /reports/sprints-overview) status 200", code == 200 and isinstance(sprints_overview, list))
    if sprints_overview:
        p0 = sprints_overview[0]
        check("Item contains project name and overallProgress", "project" in p0 and "overallProgress" in p0)
        check("Item contains 4 sprints array", isinstance(p0.get("sprints"), list) and len(p0["sprints"]) == 4)

    # 6. Bloggers CRUD
    print("\n👉 6. Bloggers API & Database Persistence")
    code, bloggers = request("GET", "/api/v1/bloggers/")
    check("Bloggers list (GET /bloggers/) status 200", code == 200 and isinstance(bloggers, list))
    check("Bloggers count >= 1", len(bloggers) >= 1)

    # Create new test blogger
    test_blogger_payload = {
        "name": "Тестовый Блогер QA",
        "handle": "@test_blogger_qa",
        "platform": "Instagram",
        "followers": "50K",
        "reach": "15K",
        "views": 12000,
        "format": "Reels",
        "price": "$150",
        "status": "В работе",
        "project_id": first_proj_id
    }
    code, created_b = request("POST", "/api/v1/bloggers/", test_blogger_payload)
    created_id = created_b.get("id")
    check("Create blogger (POST /bloggers/) status 200", code == 200 and bool(created_id))

    # Update test blogger
    if created_id:
        code, updated_b = request("PUT", f"/api/v1/bloggers/{created_id}", {"price": "$220", "status": "Оплачено"})
        check("Update blogger (PUT /bloggers/:id) status 200", code == 200 and updated_b.get("price") == "$220")

        # Delete test blogger
        code, del_res = request("DELETE", f"/api/v1/bloggers/{created_id}")
        check("Delete blogger (DELETE /bloggers/:id) status 200", code == 200)

    # 7. RNP Items
    print("\n👉 7. RNP Indicators (Plans & Facts)")
    code, rnp_items = request("GET", "/api/v1/rnp/")
    check("RNP items (GET /rnp/) status 200", code == 200 and isinstance(rnp_items, list))
    check("RNP items loaded from CSV/DB (count > 0)", len(rnp_items) > 0)

    # 8. Global Search
    print("\n👉 8. Global Unified Search")
    code, search_res = request("GET", "/api/v1/search/?q=Extragel")
    check("Search (GET /search/?q=Extragel) status 200", code == 200 and isinstance(search_res, list))

    # 9. Telegram Bot Endpoints
    print("\n👉 9. Telegram Bot Integration")
    code, tg_status = request("GET", "/api/v1/telegram/status")
    check("Telegram status (GET /telegram/status) status 200", code == 200 and "configured" in tg_status)

    code, tg_summary = request("POST", "/api/v1/telegram/send-summary")
    check("Telegram send-summary (POST /telegram/send-summary) status 200", code == 200 and "preview" in tg_summary)

    # Summary
    print("\n============================================================")
    print(f"📊 SUMMARY: Total: {total} | Passed: {passed} | Failed: {failed}")
    print("============================================================\n")

    if failed > 0:
        sys.exit(1)
    else:
        print("🎉 ALL BACKEND CHECKS PASSED PERFECTLY!\n")
        sys.exit(0)

if __name__ == "__main__":
    run_tests()
