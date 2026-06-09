import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic = Column(String(2000), nullable=False)
    niche = Column(String(100), nullable=True)
    language = Column(String(50), default="Indonesian")
    platform = Column(String(50), default="YouTube Shorts")
    duration = Column(String(50), default="45-60 seconds")
    style = Column(Text, nullable=True)
    status = Column(String(50), default="created")
    selected_angle_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    angles = relationship("Angle", back_populates="project", cascade="all, delete-orphan")
    scripts = relationship("Script", back_populates="project", cascade="all, delete-orphan")
    storyboards = relationship("Storyboard", back_populates="project", cascade="all, delete-orphan")
    metadata_outputs = relationship("MetadataOutput", back_populates="project", cascade="all, delete-orphan")


class Angle(Base):
    __tablename__ = "angles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    hook = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="angles")


class Script(Base):
    __tablename__ = "scripts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    angle_id = Column(UUID(as_uuid=True), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="scripts")


class Storyboard(Base):
    __tablename__ = "storyboards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    scene_number = Column(Integer, nullable=False)
    duration = Column(String(50), nullable=True)
    voice_over = Column(Text, nullable=True)
    visual = Column(Text, nullable=True)
    image_prompt = Column(Text, nullable=True)
    video_prompt = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="storyboards")


class MetadataOutput(Base):
    __tablename__ = "metadata_outputs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    titles = Column(JSON, default=list)
    description = Column(Text, nullable=True)
    tags = Column(JSON, default=list)
    pinned_comments = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="metadata_outputs")
