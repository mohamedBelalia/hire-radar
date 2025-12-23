from flask import request, jsonify
from config.db import SessionLocal
from core.models import User, Job, Skill, Category
from controllers.utils import get_user_id_from_token
from sqlalchemy import or_, func


def search_all():
    q = request.args.get("query") or request.args.get("q") or request.args.get("search") or ""
    q = q.strip()
    db = SessionLocal()
    try:
        # try get current user id if provided, otherwise None
        current_user_id = None
        try:
            current_user_id = get_user_id_from_token()
        except Exception:
            current_user_id = None

        result = {"employers": [], "candidates": [], "jobs": []}

        if not q:
            return jsonify(result), 200

        like_q = f"%{q}%"

        # Employers: search by companyName, full_name, email
        employers = (
            db.query(User)
            .filter(User.role == "employer")
            .filter(
                or_(
                    User.companyName.ilike(like_q),
                    User.full_name.ilike(like_q),
                    User.email.ilike(like_q),
                )
            )
            .limit(6)
            .all()
        )

        for e in employers:
            if current_user_id and e.id == current_user_id:
                continue
            result["employers"].append(
                {
                    "id": e.id,
                    "role": e.role,
                    "full_name": e.full_name,
                    "headLine": getattr(e, "headLine", ""),
                    "image": e.image,
                }
            )

        # Candidates: search by full_name, headLine, skills
        candidates_q = (
            db.query(User)
            .filter(User.role == "candidate")
            .filter(
                or_(
                    User.full_name.ilike(like_q),
                    getattr(User, "headLine").ilike(like_q),
                )
            )
            .limit(6)
            .all()
        )

        for c in candidates_q:
            if current_user_id and c.id == current_user_id:
                continue
            result["candidates"].append(
                {
                    "id": c.id,
                    "role": c.role,
                    "full_name": c.full_name,
                    "headLine": getattr(c, "headLine", ""),
                    "image": c.image,
                }
            )

        # Also search candidates by skill name
        skill_matches = (
            db.query(User)
            .join(User.skills)
            .filter(User.role == "candidate")
            .filter(Skill.name.ilike(like_q))
            .limit(6)
            .all()
        )

        for c in skill_matches:
            if any(cm["id"] == c.id for cm in result["candidates"]):
                continue
            if current_user_id and c.id == current_user_id:
                continue
            result["candidates"].append(
                {
                    "id": c.id,
                    "role": c.role,
                    "full_name": c.full_name,
                    "headLine": getattr(c, "headLine", ""),
                    "image": c.image,
                }
            )

        # Jobs: search by title, company, description, category
        jobs = (
            db.query(Job)
            .outerjoin(Category, Job.category)
            .filter(
                or_(
                    Job.title.ilike(like_q),
                    Job.description.ilike(like_q),
                    Job.company.ilike(like_q),
                    Category.name.ilike(like_q),
                )
            )
            .limit(12)
            .all()
        )

        for j in jobs:
            desc = (j.description or "")
            short = desc[:100] + ("..." if len(desc) > 100 else "")
            result["jobs"].append(
                {
                    "id": j.id,
                    "title": j.title,
                    "description": short,
                }
            )

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
