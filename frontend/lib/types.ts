export interface Project {
  id: string;
  topic: string;
  niche?: string;
  language?: string;
  platform?: string;
  duration?: string;
  style?: string;
  status: string;
  selected_angle_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Angle {
  id: string;
  project_id: string;
  title: string;
  hook?: string;
  description?: string;
  created_at: string;
}

export interface Script {
  id: string;
  project_id: string;
  angle_id?: string;
  content: string;
  created_at: string;
}

export interface StoryboardScene {
  id: string;
  project_id: string;
  scene_number: number;
  duration?: string;
  voice_over?: string;
  visual?: string;
  image_prompt?: string;
  video_prompt?: string;
  created_at: string;
}

export interface MetadataOutput {
  id: string;
  project_id: string;
  titles: string[];
  description?: string;
  tags: string[];
  pinned_comments: string[];
  created_at: string;
}

export interface ProjectDetail extends Project {
  angles: Angle[];
  scripts: Script[];
  storyboards: StoryboardScene[];
  metadata_outputs: MetadataOutput[];
}
