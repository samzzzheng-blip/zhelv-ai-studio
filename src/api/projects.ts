import { request } from './http'

export interface ApiProject {
  projectId: number
  projectName: string
  orgId?: number
  userId: number
  mode: '1' | '2'
  description?: string
  scene: 'SCENIC' | 'CITY' | 'FESTIVAL' | 'HERITAGE'
  theme: 'LANDSCAPE' | 'HISTORY' | 'FOOD' | 'NIGHT'
  duration: number
  aspectRatio: '9:16' | '16:9' | '1:1'
  status: '0' | '1' | '2' | '3' | '4'
  createBy: string
  createTime: string
  updateTime?: string
  remark?: string
}

export interface ProjectQuery {
  pageNum?: number
  pageSize?: number
  projectName?: string
  status?: string
  scene?: string
  theme?: string
  mode?: string
  orderByColumn?: string
  isAsc?: 'asc' | 'desc'
}

export interface ProjectListResponse {
  code: number
  msg: string
  total: number
  rows: ApiProject[]
}

export type CreateProjectPayload = Pick<ApiProject, 'mode' | 'description' | 'scene' | 'theme' | 'duration' | 'aspectRatio'>
export type UpdateProjectPayload = Partial<CreateProjectPayload> & Pick<ApiProject, 'projectId'> & { remark?: string }

export const listProjects = (query: ProjectQuery = {}) => request<ProjectListResponse>('/management/project/list', { query: { ...query } })
export const getProject = (projectId: number) => request<{ code: number; msg: string; data: ApiProject | null }>(`/management/project/${projectId}`)
export const createProject = (payload: CreateProjectPayload) => request('/management/project', { method: 'POST', body: payload })
export const updateProject = (payload: UpdateProjectPayload) => request('/management/project', { method: 'PUT', body: payload })
export const deleteProjects = (projectIds: number[]) => request(`/management/project/${projectIds.join(',')}`, { method: 'DELETE' })
