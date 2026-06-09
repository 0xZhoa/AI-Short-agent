from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.database import get_db
from app.models import Project, Angle, Script, Storyboard, MetadataOutput
from app.schemas import (
    ProjectSelectAngle, ProjectResponse, AngleResponse,
    ScriptResponse, StoryboardResponse, MetadataResponse,
    ScriptGenerateRequest, StoryboardGenerateRequest
)
from app.services import gemini_service

router = APIRouter(prefix="/api/projects", tags=["generation"])

@router.post("/{project_id}/generate-angles", response_model=List[AngleResponse])
def generate_angles(project_id: UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    try:
        angles_data = gemini_service.generate_angles(project)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate angles: {str(e)}"
        )
        
    # Clear existing angles
    db.query(Angle).filter(Angle.project_id == project_id).delete()
    
    # Save new angles
    db_angles = []
    for data in angles_data:
        db_angle = Angle(
            project_id=project_id,
            title=data.get("title", "Untitled Angle"),
            hook=data.get("hook", ""),
            description=data.get("description", "")
        )
        db.add(db_angle)
        db_angles.append(db_angle)
        
    project.status = "angles_generated"
    db.commit()
    
    for db_angle in db_angles:
        db.refresh(db_angle)
        
    return db_angles

@router.post("/{project_id}/select-angle", response_model=ProjectResponse)
def select_angle(project_id: UUID, selection: ProjectSelectAngle, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    angle = db.query(Angle).filter(Angle.id == selection.angle_id, Angle.project_id == project_id).first()
    if not angle:
        raise HTTPException(
            status_code=400,
            detail="Selected angle does not exist or does not belong to this project"
        )
        
    project.selected_angle_id = selection.angle_id
    project.status = "angle_selected"
    db.commit()
    db.refresh(project)
    return project

@router.post("/{project_id}/generate-script", response_model=ScriptResponse)
def generate_script(project_id: UUID, req: Optional[ScriptGenerateRequest] = None, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if not project.selected_angle_id:
        raise HTTPException(status_code=400, detail="No angle selected for this project")
        
    angle = db.query(Angle).filter(Angle.id == project.selected_angle_id).first()
    if not angle:
        raise HTTPException(status_code=400, detail="Selected angle not found")
        
    word_count = req.word_count if req else None
    try:
        script_content = gemini_service.generate_script(project, angle, word_count)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate script: {str(e)}"
        )
        
    # Clear existing scripts
    db.query(Script).filter(Script.project_id == project_id).delete()
    
    # Save new script
    db_script = Script(
        project_id=project_id,
        angle_id=project.selected_angle_id,
        content=script_content
    )
    db.add(db_script)
    
    project.status = "script_generated"
    db.commit()
    db.refresh(db_script)
    
    return db_script

@router.post("/{project_id}/generate-storyboard", response_model=List[StoryboardResponse])
def generate_storyboard(project_id: UUID, req: Optional[StoryboardGenerateRequest] = None, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    script = db.query(Script).filter(Script.project_id == project_id).first()
    if not script:
        raise HTTPException(status_code=400, detail="No script found for this project. Generate script first.")
        
    image_reference = req.image_reference if req else None
    try:
        scenes_data = gemini_service.generate_storyboard(project, script, image_reference)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate storyboard: {str(e)}"
        )
        
    # Clear existing storyboard scenes
    db.query(Storyboard).filter(Storyboard.project_id == project_id).delete()
    
    # Save new scenes
    db_scenes = []
    for data in scenes_data:
        db_scene = Storyboard(
            project_id=project_id,
            scene_number=data.get("scene_number", 1),
            duration=data.get("duration", ""),
            voice_over=data.get("voice_over", ""),
            visual=data.get("visual", ""),
            image_prompt=data.get("image_prompt", ""),
            video_prompt=data.get("video_prompt", "")
        )
        db.add(db_scene)
        db_scenes.append(db_scene)
        
    project.status = "storyboard_generated"
    db.commit()
    
    for db_scene in db_scenes:
        db.refresh(db_scene)
        
    return db_scenes

@router.post("/{project_id}/generate-metadata", response_model=MetadataResponse)
def generate_metadata(project_id: UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    script = db.query(Script).filter(Script.project_id == project_id).first()
    storyboard = db.query(Storyboard).filter(Storyboard.project_id == project_id).all()
    
    if not script:
        raise HTTPException(status_code=400, detail="No script found. Generate script first.")
    if not storyboard:
        raise HTTPException(status_code=400, detail="No storyboard found. Generate storyboard first.")
        
    try:
        metadata_data = gemini_service.generate_metadata(project, script, storyboard)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate metadata: {str(e)}"
        )
        
    # Clear existing metadata outputs
    db.query(MetadataOutput).filter(MetadataOutput.project_id == project_id).delete()
    
    # Save new metadata
    db_metadata = MetadataOutput(
        project_id=project_id,
        titles=metadata_data.get("titles", []),
        description=metadata_data.get("description", ""),
        tags=metadata_data.get("tags", []),
        pinned_comments=metadata_data.get("pinned_comments", [])
    )
    db.add(db_metadata)
    
    project.status = "completed"
    db.commit()
    db.refresh(db_metadata)
    
    return db_metadata
