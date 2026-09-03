export type GenerationTaskStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED'
export type GenerationStageStatus = 'DONE' | 'RUNNING' | 'WAITING' | 'FAILED' | 'SKIPPED'

export interface GenerationStage {
  key: string
  name: string
  description: string
  status: GenerationStageStatus
  progress: number
  duration?: string
  message?: string
}

export interface GenerationTask {
  taskId: string
  taskName: string
  projectId: number
  projectName: string
  city: string
  mode: '1' | '2'
  duration: number
  aspectRatio: '9:16' | '16:9' | '1:1'
  status: GenerationTaskStatus
  progress: number
  currentStage: string
  retryCount: number
  creatorName: string
  createdTime: string
  startedTime?: string
  finishedTime?: string
  elapsed: string
  errorCode?: string
  errorMessage?: string
  outputName?: string
  outputSize?: string
  stages: GenerationStage[]
}

export interface GenerationTaskQuery {
  pageNum?: number
  pageSize?: number
  status?: GenerationTaskStatus
  keyword?: string
}

export interface GenerationTaskListResponse {
  total: number
  rows: GenerationTask[]
  counts: Record<'ALL' | GenerationTaskStatus, number>
}

const stage = (key: string, name: string, status: GenerationStageStatus, progress: number, description: string, duration?: string, message?: string): GenerationStage => ({
  key, name, status, progress, description, duration, message,
})

const completedStages = [
  stage('brief', '需求解析', 'DONE', 100, '解析城市、场景、画幅与受众偏好', '8 秒'),
  stage('copy', '文案生成', 'DONE', 100, '生成旁白与镜头文案', '42 秒'),
  stage('storyboard', '分镜生成', 'DONE', 100, '构建镜头节奏和视觉结构', '1 分 06 秒'),
  stage('voice', '配音合成', 'DONE', 100, '生成旁白并完成时轴对齐', '38 秒'),
  stage('render', '视频渲染', 'DONE', 100, '合成画面、字幕、音乐与旁白', '2 分 14 秒'),
]

const mockTasks: GenerationTask[] = [
  {
    taskId: 'GEN-20260903-0842', taskName: '西湖夏日夜游·竖屏成片', projectId: 1042, projectName: '西湖夏日夜游', city: '杭州', mode: '2', duration: 30, aspectRatio: '9:16', status: 'RUNNING', progress: 68, currentStage: '配音合成', retryCount: 0, creatorName: '周亦安', createdTime: '2026-09-03 10:18', startedTime: '2026-09-03 10:19', elapsed: '3 分 24 秒',
    stages: [
      stage('brief', '需求解析', 'DONE', 100, '解析城市、场景、画幅与受众偏好', '9 秒'),
      stage('copy', '文案生成', 'DONE', 100, '生成旁白与镜头文案', '46 秒'),
      stage('storyboard', '分镜生成', 'DONE', 100, '构建 8 个镜头及转场节奏', '1 分 12 秒'),
      stage('voice', '配音合成', 'RUNNING', 54, '生成旁白并对齐字幕时轴'),
      stage('render', '视频渲染', 'WAITING', 0, '合成画面、字幕、音乐与旁白'),
    ],
  },
  {
    taskId: 'GEN-20260903-0837', taskName: '良渚文明城市名片', projectId: 1038, projectName: '良渚文明城市名片', city: '杭州', mode: '2', duration: 45, aspectRatio: '16:9', status: 'FAILED', progress: 76, currentStage: '视频渲染', retryCount: 1, creatorName: '周亦安', createdTime: '2026-09-03 09:42', startedTime: '2026-09-03 09:43', finishedTime: '2026-09-03 09:49', elapsed: '6 分 18 秒', errorCode: 'RENDER_AUDIO_MISMATCH', errorMessage: '第 6 个镜头的旁白时长超出画面时长 2.4 秒，无法完成时轴对齐。',
    stages: [...completedStages.slice(0, 4), stage('render', '视频渲染', 'FAILED', 38, '合成画面、字幕、音乐与旁白', '2 分 31 秒', '旁白与画面时长不匹配')],
  },
  { taskId: 'GEN-20260903-0829', taskName: '东钱湖周末漫游', projectId: 1035, projectName: '东钱湖周末漫游', city: '宁波', mode: '1', duration: 30, aspectRatio: '9:16', status: 'SUCCEEDED', progress: 100, currentStage: '已完成', retryCount: 0, creatorName: '沈若溪', createdTime: '2026-09-03 09:08', startedTime: '2026-09-03 09:08', finishedTime: '2026-09-03 09:13', elapsed: '4 分 52 秒', outputName: 'dongqianhu-weekend-v1.mp4', outputSize: '86.4 MB', stages: completedStages },
  { taskId: 'GEN-20260903-0825', taskName: '大运河拱宸桥晨光', projectId: 1031, projectName: '运河宋韵旅程', city: '杭州', mode: '1', duration: 15, aspectRatio: '9:16', status: 'QUEUED', progress: 0, currentStage: '等待调度', retryCount: 0, creatorName: '陈端', createdTime: '2026-09-03 08:54', elapsed: '—', stages: [stage('brief', '需求解析', 'WAITING', 0, '解析城市、场景、画幅与受众偏好'), stage('copy', '文案生成', 'WAITING', 0, '生成旁白与镜头文案'), stage('storyboard', '分镜生成', 'WAITING', 0, '构建镜头节奏和视觉结构'), stage('voice', '配音合成', 'WAITING', 0, '生成旁白并完成时轴对齐'), stage('render', '视频渲染', 'WAITING', 0, '合成成片') ] },
  { taskId: 'GEN-20260902-0818', taskName: '南浔古镇夜航', projectId: 1028, projectName: '水乡夜经济推荐', city: '湖州', mode: '2', duration: 45, aspectRatio: '16:9', status: 'RUNNING', progress: 31, currentStage: '分镜生成', retryCount: 0, creatorName: '林嘉树', createdTime: '2026-09-02 18:36', startedTime: '2026-09-03 10:12', elapsed: '2 分 51 秒', stages: [stage('brief', '需求解析', 'DONE', 100, '解析需求', '11 秒'), stage('copy', '文案生成', 'DONE', 100, '生成旁白文案', '51 秒'), stage('storyboard', '分镜生成', 'RUNNING', 36, '构建镜头节奏'), stage('voice', '配音合成', 'WAITING', 0, '生成旁白'), stage('render', '视频渲染', 'WAITING', 0, '合成成片')] },
  { taskId: 'GEN-20260902-0814', taskName: '鲁迅故里秋日人文', projectId: 1024, projectName: '绍兴名人故里', city: '绍兴', mode: '1', duration: 30, aspectRatio: '1:1', status: 'CANCELED', progress: 22, currentStage: '已取消', retryCount: 0, creatorName: '许青', createdTime: '2026-09-02 16:20', startedTime: '2026-09-02 16:21', finishedTime: '2026-09-02 16:22', elapsed: '1 分 04 秒', stages: [stage('brief', '需求解析', 'DONE', 100, '解析需求', '8 秒'), stage('copy', '文案生成', 'SKIPPED', 22, '用户已取消任务'), stage('storyboard', '分镜生成', 'SKIPPED', 0, '未执行'), stage('voice', '配音合成', 'SKIPPED', 0, '未执行'), stage('render', '视频渲染', 'SKIPPED', 0, '未执行')] },
  { taskId: 'GEN-20260902-0809', taskName: '横店影视城宋韵季', projectId: 1019, projectName: '金华宋韵主题', city: '金华', mode: '2', duration: 60, aspectRatio: '16:9', status: 'SUCCEEDED', progress: 100, currentStage: '已完成', retryCount: 2, creatorName: '方正明', createdTime: '2026-09-02 14:12', startedTime: '2026-09-02 14:13', finishedTime: '2026-09-02 14:22', elapsed: '9 分 07 秒', outputName: 'hengdian-song-v3.mp4', outputSize: '152.7 MB', stages: completedStages },
  { taskId: 'GEN-20260902-0802', taskName: '江郎山云海十五秒', projectId: 1015, projectName: '衢州山水快闪', city: '衢州', mode: '1', duration: 15, aspectRatio: '9:16', status: 'FAILED', progress: 44, currentStage: '素材检查', retryCount: 0, creatorName: '郑菲', createdTime: '2026-09-02 11:46', startedTime: '2026-09-02 11:47', finishedTime: '2026-09-02 11:49', elapsed: '1 分 33 秒', errorCode: 'ASSET_UNAVAILABLE', errorMessage: '项目中的 1 个授权素材已失效，请替换后重试。', stages: [stage('brief', '需求解析', 'DONE', 100, '解析需求', '9 秒'), stage('assets', '素材检查', 'FAILED', 44, '校验素材来源与授权', '1 分 24 秒', '授权素材已失效'), stage('storyboard', '分镜生成', 'WAITING', 0, '待执行'), stage('voice', '配音合成', 'WAITING', 0, '待执行'), stage('render', '视频渲染', 'WAITING', 0, '待执行')] },
  { taskId: 'GEN-20260901-0797', taskName: '东沙古镇海岛日记', projectId: 1012, projectName: '舟山海岛风物', city: '舟山', mode: '1', duration: 30, aspectRatio: '9:16', status: 'SUCCEEDED', progress: 100, currentStage: '已完成', retryCount: 0, creatorName: '夏屹', createdTime: '2026-09-01 17:20', startedTime: '2026-09-01 17:20', finishedTime: '2026-09-01 17:25', elapsed: '5 分 12 秒', outputName: 'dongsha-island-v1.mp4', outputSize: '91.2 MB', stages: completedStages },
  { taskId: 'GEN-20260901-0792', taskName: '雁荡山飞渡晨雾', projectId: 1007, projectName: '温州山水之旅', city: '温州', mode: '2', duration: 45, aspectRatio: '16:9', status: 'QUEUED', progress: 0, currentStage: '等待调度', retryCount: 0, creatorName: '叶行舟', createdTime: '2026-09-01 15:06', elapsed: '—', stages: [stage('brief', '需求解析', 'WAITING', 0, '待执行'), stage('copy', '文案生成', 'WAITING', 0, '待执行'), stage('storyboard', '分镜生成', 'WAITING', 0, '待执行'), stage('voice', '配音合成', 'WAITING', 0, '待执行'), stage('render', '视频渲染', 'WAITING', 0, '待执行')] },
]

let tasks = mockTasks.map((task) => ({ ...task, stages: task.stages.map((item) => ({ ...item })) }))

const wait = (milliseconds = 260) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

export async function listGenerationTasks(query: GenerationTaskQuery = {}): Promise<GenerationTaskListResponse> {
  await wait()
  const keyword = query.keyword?.trim().toLowerCase() ?? ''
  const filtered = tasks.filter((task) => (!query.status || task.status === query.status)
    && (!keyword || `${task.taskName}${task.taskId}${task.projectName}${task.city}${task.creatorName}`.toLowerCase().includes(keyword)))
  const pageNum = query.pageNum ?? 1
  const pageSize = query.pageSize ?? 8
  const start = (pageNum - 1) * pageSize
  return {
    total: filtered.length,
    rows: filtered.slice(start, start + pageSize),
    counts: {
      ALL: tasks.length,
      QUEUED: tasks.filter((task) => task.status === 'QUEUED').length,
      RUNNING: tasks.filter((task) => task.status === 'RUNNING').length,
      SUCCEEDED: tasks.filter((task) => task.status === 'SUCCEEDED').length,
      FAILED: tasks.filter((task) => task.status === 'FAILED').length,
      CANCELED: tasks.filter((task) => task.status === 'CANCELED').length,
    },
  }
}

export async function getGenerationTask(taskId: string): Promise<GenerationTask> {
  await wait(140)
  const task = tasks.find((item) => item.taskId === taskId)
  if (!task) throw new Error('生成任务不存在或已被删除。')
  return task
}

export async function retryGenerationTask(taskId: string) {
  await wait(360)
  tasks = tasks.map((task) => task.taskId === taskId ? {
    ...task,
    status: 'QUEUED', progress: 0, currentStage: '等待调度', retryCount: task.retryCount + 1,
    errorCode: undefined, errorMessage: undefined, startedTime: undefined, finishedTime: undefined, elapsed: '—',
    stages: task.stages.map((item) => ({ ...item, status: 'WAITING', progress: 0, duration: undefined, message: undefined })),
  } : task)
}

export async function cancelGenerationTask(taskId: string) {
  await wait(320)
  tasks = tasks.map((task) => task.taskId === taskId ? {
    ...task, status: 'CANCELED', currentStage: '已取消', finishedTime: '2026-09-03 10:24',
  } : task)
}
