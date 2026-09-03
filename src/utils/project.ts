import type { ApiProject } from '@/api/projects'
import type { Project, ProjectStatus } from '@/types'

const statusMap: Record<ApiProject['status'], ProjectStatus> = {
  '0': 'draft',
  '1': 'generating',
  '2': 'review',
  '3': 'approved',
  '4': 'rejected',
}

export const sceneLabels: Record<ApiProject['scene'], string> = {
  SCENIC: '景区推荐',
  CITY: '城市形象',
  FESTIVAL: '节庆活动',
  HERITAGE: '非遗文化',
}

export const themeLabels: Record<ApiProject['theme'], string> = {
  LANDSCAPE: '山水风光',
  HISTORY: '历史人文',
  FOOD: '美食探店',
  NIGHT: '夜经济',
}

const thumbnails: Record<ApiProject['scene'], string> = {
  SCENIC: '/images/west-lake-boat.jpg',
  CITY: '/images/zhejiang-mist-lake.png',
  FESTIVAL: '/images/jiangnan-boats.jpg',
  HERITAGE: '/images/qiandao-lake.jpg',
}

function formatTime(value: string) {
  const date = new Date(value.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

export function toUiProject(project: ApiProject): Project {
  const status = statusMap[project.status]
  const city = project.description?.match(/^【城市：([^】]+)】/)?.[1] ?? '浙江'
  return {
    id: String(project.projectId),
    title: project.projectName,
    city,
    scene: sceneLabels[project.scene],
    style: themeLabels[project.theme],
    duration: project.duration,
    ratio: project.aspectRatio,
    status,
    progress: status === 'generating' ? 50 : status === 'draft' ? 0 : 100,
    updatedAt: formatTime(project.updateTime || project.createTime),
    thumbnail: thumbnails[project.scene],
    owner: project.createBy,
  }
}
