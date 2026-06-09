from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models import Project, Script
from app.schemas import ProjectCreate, ProjectResponse, ProjectDetailResponse, ScriptResponse, ScriptUpdateRequest

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(
        topic=project_in.topic,
        niche=project_in.niche,
        language=project_in.language,
        platform=project_in.platform,
        duration=project_in.duration,
        style=project_in.style,
        status="created"
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    # Order by newest first
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return projects

@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project(project_id: UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {project_id} not found"
        )
    return project

@router.put("/{project_id}/script", response_model=ScriptResponse)
def update_project_script(project_id: UUID, script_in: ScriptUpdateRequest, db: Session = Depends(get_db)):
    script = db.query(Script).filter(Script.project_id == project_id).first()
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Script for project ID {project_id} not found"
        )
    script.content = script_in.content
    db.commit()
    db.refresh(script)
    return script
