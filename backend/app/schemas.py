from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class ProjectCreate(BaseModel):
    topic: str
    niche: Optional[str] = None
    language: Optional[str] = "Indonesian"
    platform: Optional[str] = "YouTube Shorts"
    duration: Optional[str] = "45-60 seconds"
    style: Optional[str] = None


class ProjectResponse(BaseModel):
    id: UUID
    topic: str
    niche: Optional[str] = None
    language: Optional[str] = None
    platform: Optional[str] = None
    duration: Optional[str] = None
    style: Optional[str] = None
    status: str
    selected_angle_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectSelectAngle(BaseModel):
    angle_id: UUID


class AngleResponse(BaseModel):
    id: UUID
    project_id: UUID
    title: str
    hook: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ScriptResponse(BaseModel):
    id: UUID
    project_id: UUID
    angle_id: Optional[UUID] = None
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class StoryboardResponse(BaseModel):
    id: UUID
    project_id: UUID
    scene_number: int
    duration: Optional[str] = None
    voice_over: Optional[str] = None
    visual: Optional[str] = None
    image_prompt: Optional[str] = None
    video_prompt: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MetadataResponse(BaseModel):
    id: UUID
    project_id: UUID
    titles: List[str] = []
    description: Optional[str] = None
    tags: List[str] = []
    pinned_comments: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectDetailResponse(ProjectResponse):
    angles: List[AngleResponse] = []
    scripts: List[ScriptResponse] = []
    storyboards: List[StoryboardResponse] = []
    metadata_outputs: List[MetadataResponse] = []

    class Config:
        from_attributes = True


class ScriptGenerateRequest(BaseModel):
    word_count: Optional[int] = None


class StoryboardGenerateRequest(BaseModel):
    image_reference: Optional[str] = None


class ScriptUpdateRequest(BaseModel):
    content: str

