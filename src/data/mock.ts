import type { GenerationNode, Project, RiskItem } from '@/types'

export const projects: Project[] = [
  { id: 'p-2408-01', title: '西湖十景夏日特辑', city: '杭州', scene: '景区推荐', style: '山海活力', duration: 60, ratio: '16:9', status: 'generating', progress: 68, updatedAt: '今天 10:32', thumbnail: '/images/west-lake-boat.jpg', owner: '林知夏' },
  { id: 'p-2408-02', title: '良渚文明城市名片', city: '杭州', scene: '城市形象', style: '宋韵水墨', duration: 45, ratio: '9:16', status: 'review', progress: 100, updatedAt: '昨天 18:46', thumbnail: '/images/jiangnan-boats.jpg', owner: '周亦安' },
  { id: 'p-2408-03', title: '东钱湖周末漫游', city: '宁波', scene: '景区推荐', style: '乡村治愈', duration: 30, ratio: '9:16', status: 'approved', progress: 100, updatedAt: '8 月 6 日', thumbnail: '/images/qiandao-lake.jpg', owner: '沈青禾' },
  { id: 'p-2408-04', title: '乌镇戏剧节预热', city: '嘉兴', scene: '节庆活动', style: '都市现代', duration: 30, ratio: '16:9', status: 'draft', progress: 0, updatedAt: '8 月 5 日', thumbnail: '/images/jiangnan-boats.jpg', owner: '许明川' },
  { id: 'p-2408-05', title: '雁荡山奇峰云海', city: '温州', scene: '城市形象', style: '山海活力', duration: 45, ratio: '16:9', status: 'rejected', progress: 100, updatedAt: '8 月 4 日', thumbnail: '/images/zhejiang-mist-lake.png', owner: '林知夏' },
]

export const nodes: GenerationNode[] = [
  { id: 'copy', title: '文案创作', description: '事实卡片已绑定 12 条', status: 'done', detail: '以西湖晨雾为引，串联断桥、曲院风荷与三潭印月，形成一条 60 秒夏日漫游线。' },
  { id: 'style', title: '风格生成', description: '清透江南 · 青绿水色', status: 'done', detail: '冷青色主调，柔和晨光，航拍与平视镜头交替，人物出现时保持自然纪实感。' },
  { id: 'storyboard', title: '脚本与分镜', description: '6 个镜头 · 60 秒', status: 'done', detail: '镜头从湖面晨雾开始，在城市生活与人文地标间递进，结尾回到水面形成闭环。' },
  { id: 'media', title: '音视频生成', description: '镜头 5 正在补帧', status: 'running', detail: '已完成 5/6 个镜头，普通话女声旁白已生成，背景音乐正在进行版权匹配。' },
  { id: 'final', title: '最终版本', description: '等待媒体节点完成', status: 'waiting', detail: '完成后将自动合成 720P 预览片，并进入事实、内容安全与版权检查。' },
]

export const risks: RiskItem[] = [
  { id: 'r1', level: 'high', category: '事实校验', title: '景区开放时间需要复核', description: '字幕中的夜游开放时间与最新官方信息存在差异，建议采用来源卡片中的当前口径。', timecode: '00:18' },
  { id: 'r2', level: 'medium', category: '版权合规', title: '背景音乐授权范围待确认', description: '当前音乐授权覆盖信息流投放，不包含线下大屏播放。', timecode: '全片' },
  { id: 'r3', level: 'low', category: '文化表述', title: '建议弱化绝对化表达', description: '“江南第一名湖”缺少统一权威来源，建议调整为更准确的描述。', timecode: '00:07' },
]
