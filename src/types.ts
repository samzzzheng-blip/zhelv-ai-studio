export type ProjectStatus = 'draft' | 'generating' | 'review' | 'approved' | 'rejected'

export interface Project {
  id: string
  title: string
  city: string
  scene: string
  style: string
  duration: number
  ratio: string
  status: ProjectStatus
  progress: number
  updatedAt: string
  thumbnail: string
  owner: string
}

export interface GenerationNode {
  id: string
  title: string
  description: string
  status: 'done' | 'running' | 'waiting' | 'warning'
  detail: string
}

export interface RiskItem {
  id: string
  level: 'high' | 'medium' | 'low'
  category: string
  title: string
  description: string
  timecode: string
}
