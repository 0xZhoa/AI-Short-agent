import { Project, Angle, Script, StoryboardScene, MetadataOutput, ProjectDetail } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Projects
  async createProject(input: {
    topic: string;
    niche?: string;
    language?: string;
    platform?: string;
    duration?: string;
    style?: string;
  }): Promise<Project> {
    return request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getProjects(): Promise<Project[]> {
    return request<Project[]>('/api/projects');
  },

  async getProject(id: string): Promise<ProjectDetail> {
    return request<ProjectDetail>(`/api/projects/${id}`);
  },

  // Generations
  async generateAngles(projectId: string): Promise<Angle[]> {
    return request<Angle[]>(`/api/projects/${projectId}/generate-angles`, {
      method: 'POST',
    });
  },

  async selectAngle(projectId: string, angleId: string): Promise<Project> {
    return request<Project>(`/api/projects/${projectId}/select-angle`, {
      method: 'POST',
      body: JSON.stringify({ angle_id: angleId }),
    });
  },

  async generateScript(projectId: string, wordCount?: number): Promise<Script> {
    return request<Script>(`/api/projects/${projectId}/generate-script`, {
      method: 'POST',
      body: JSON.stringify({ word_count: wordCount }),
    });
  },

  async generateStoryboard(projectId: string, imageReference?: string): Promise<StoryboardScene[]> {
    return request<StoryboardScene[]>(`/api/projects/${projectId}/generate-storyboard`, {
      method: 'POST',
      body: JSON.stringify({ image_reference: imageReference }),
    });
  },

  async generateMetadata(projectId: string): Promise<MetadataOutput> {
    return request<MetadataOutput>(`/api/projects/${projectId}/generate-metadata`, {
      method: 'POST',
    });
  },

  async updateScript(projectId: string, content: string): Promise<Script> {
    return request<Script>(`/api/projects/${projectId}/script`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },
};
export default api;
