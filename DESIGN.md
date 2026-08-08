---
name: "浙旅智创"
description: "以矿物青玉与江南雾境承载可追溯城市短视频生产的克制型政务 SaaS 设计系统"
colors:
  ink: "#162321"
  muted: "#697976"
  muted-subtle: "#96a3a1"
  canvas-mist: "#f3f7f6"
  surface: "#ffffff"
  surface-soft: "#f7faf9"
  line: "#dde7e4"
  line-strong: "#cbd9d5"
  mineral-teal: "#397f7a"
  mineral-teal-strong: "#286a66"
  mineral-teal-soft: "#e3f1ee"
  lake-cyan: "#6aa7b2"
  success: "#3a7b5a"
  warning: "#b77934"
  danger: "#bd554f"
typography:
  display:
    fontFamily: "Microsoft YaHei UI, PingFang SC, Segoe UI, sans-serif"
    fontSize: "clamp(32px, 4.2vw, 58px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Microsoft YaHei UI, PingFang SC, Segoe UI, sans-serif"
    fontSize: "clamp(26px, 2.2vw, 34px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Microsoft YaHei UI, PingFang SC, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "Microsoft YaHei UI, PingFang SC, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Microsoft YaHei UI, PingFang SC, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  chip: "7px"
  control: "10px"
  nav: "12px"
  surface: "14px"
  workspace: "16px"
  composer: "19px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  page: "32px"
components:
  button-primary:
    backgroundColor: "{colors.mineral-teal}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 15px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.mineral-teal-strong}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 15px"
    height: "40px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 11px"
    height: "39px"
  nav-active:
    backgroundColor: "{colors.mineral-teal-soft}"
    textColor: "{colors.mineral-teal-strong}"
    typography: "{typography.label}"
    rounded: "{rounded.nav}"
    padding: "0 13px"
    height: "46px"
  card-project:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "15px"
  chip-status:
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "5px 8px"
---

# Design System: 浙旅智创

## Overview

**Creative North Star: "雾中玉简"**

“浙旅智创”的界面像一册铺开在江南晨雾中的数字玉简：矿物青玉色提供可信、清醒的操作线索，雾白与冷灰承载高密度内容，山水影像只在能够建立浙江地域感的关键时刻出现。系统服务于持续操作而非展陈，因此视觉表达克制、编辑感明确，状态、版本、来源和审核证据始终比装饰更醒目。

桌面端采用稳定的左侧工作轨与宽阔内容画布，专业流程允许更高的信息密度；移动端则将左轨折叠为紧凑头部和抽屉导航。透明与模糊只用于顶部栏、提示浮层和沉浸式创建页，以形成“雾”的空间感，不侵入表格、审核或设置等需要精确阅读的区域。

**Key Characteristics:**

- 冷静的矿物青玉单主色，辅以雾白、墨绿黑与低饱和语义色。
- 细边框、轻阴影和色调分层共同建立可信而不喧闹的工作空间。
- 面向操作的高密度排版，11px 标签与 13px 正文形成清晰节奏。
- 浙江山水影像作为场所证据与情绪锚点，而不是通用装饰背景。
- 状态、进度、审核风险和来源信息在颜色之外保留文字或形状线索。

## Colors

配色来自青玉、湖水、晨雾与湿润墨色；主色稀少而明确，语义色只服务于状态判断。

### Primary

- **矿物青玉：** 主要操作、选中态、进度与键盘焦点的统一信号。
- **深潭青：** 主操作悬停、强调文字和更强的活动状态。
- **薄荷雾：** 导航选中、轻量标签、图标底与无压力反馈面。

### Secondary

- **湖水青：** 品牌渐变与少量辅助信息中的冷色延伸，不与主操作竞争。

### Neutral

- **湿墨：** 主标题、正文与关键数字，保持接近黑色但避免生硬纯黑。
- **石灰字：** 次级说明、元数据与未选中控制。
- **远雾字：** 时间戳、辅助提示与最低层级信息。
- **晨雾画布：** 应用底色，使白色工作面保持可辨识的层级。
- **宣纸白：** 卡片、表单、审核区与主要内容容器。
- **薄雾面：** 搜索框、只读区与低优先级分组背景。
- **水线 / 深水线：** 默认分隔与悬停、聚焦时的结构边界。

### Tertiary

- **山林绿：** 已通过、已完成和可安全继续。
- **赭石黄：** 待审核、需要注意但不阻断。
- **朱砂红：** 驳回、危险、错误和未读告警。

### Named Rules

**The One Jade Rule.** 一个视图只保留一种主操作声音；矿物青玉负责“可行动”，语义色只负责“可判断”。

**The No Pure Black Rule.** 大面积文字和图标使用湿墨色，不使用纯黑压迫雾白画布。

## Typography

**Display Font:** Microsoft YaHei UI（回退至 PingFang SC、Segoe UI、sans-serif）  
**Body Font:** Microsoft YaHei UI（回退至 PingFang SC、Segoe UI、sans-serif）  
**Label Font:** Microsoft YaHei UI（回退至 PingFang SC、Segoe UI、sans-serif）

**Character:** 单一现代无衬线字体保证中文政务内容的稳定性和跨平台可读性。层级主要依赖字号、字重、字距与留白，而不通过混搭字体制造戏剧性。

### Hierarchy

- **Display**（700，响应式 32–58px，1.15）：仅用于极速创建页的核心命题；负字距让大字号保持凝练。
- **Headline**（700，响应式 26–34px，1.15）：页面一级标题与工作流主标题。
- **Title**（700，16px，1.35）：顶栏、面板与关键项目标题。
- **Body**（400，13px，1.7）：说明、创建提示和需要连续阅读的内容，推荐行长不超过 64ch。
- **Label**（600，11px，1.4）：状态、字段名、按钮、元数据与高密度工作区文字。

### Named Rules

**The Editorial Density Rule.** 11px 用于短标签与元数据，13px 用于完整语句；不要把长说明压缩进标签字号。

**The Quiet Headline Rule.** 标题通过负字距和稳定字重取得权威感，不使用全大写中文、描边字或装饰字体。

## Layout

桌面应用骨架由固定左轨、粘性顶栏和居中的内容画布组成。左轨展开宽度为 226px，收起后为 78px；顶栏高度为 72px。主页面最大宽度为 1480px，常规内边距为 32px，卡片网格以 18px 间距排列，在宽屏显示三列。

专业工作区优先使用明确的主次分栏：工作台为主画布加 310px 辅助栏，审核为 240px 队列、弹性主区和 300px 详情栏。1180px 以下减少网格列数并重排辅助区；900px 以下左轨变为抽屉，页面内边距降至 18px；680px 以下顶栏压缩为 64px，多列内容变为单列，非关键账户与通知信息隐藏。

间距以 4/8px 微节奏组织控件，以 14/18/24/32px 组织卡片、分组和页面。密度可以高，但相邻区域必须通过边界、分组背景或标题关系明确归属。

**The Trace Before Space Rule.** 当空间收缩时，优先保留状态、进度、来源和审核动作；统计摘要、用户副标题与装饰性信息可以后退或隐藏。

## Elevation & Depth

系统采用“色调分层为主、低对比阴影为辅”的混合策略。常规面板以白色表面和水线边框建立结构；阴影只用于可点击卡片、工作区容器、浮层、抽屉和沉浸式创建输入，避免把每个分组都做成悬浮卡片。半透明模糊面仅用于顶栏、图像叠层和创建页的雾境界面。

### Shadow Vocabulary

- **面板微影**（`0 8px 24px rgba(48,82,75,.04)`）：常规面板的最低层次感。
- **卡片静置**（`0 9px 30px rgba(45,78,72,.045)`）：项目卡片默认状态。
- **环境抬升**（`0 14px 38px rgba(38,77,69,.08)`）：卡片悬停、工作区和通知浮层。
- **主操作微光**（`0 7px 18px rgba(57,127,122,.15)`）：主要按钮默认状态。
- **雾境浮层**（`0 22px 65px rgba(44,80,73,.12)`）：极速创建输入等少数沉浸式焦点容器。

### Named Rules

**The Flat Workflow Rule.** 审核、设置和节点详情默认平放在结构边界中；只有交互状态或空间叠加需要阴影。

**The Mist Has a Boundary Rule.** 玻璃模糊必须同时具备可辨识边框或色调差，不能让关键文字直接漂浮在复杂影像上。

## Shapes

造型以轻柔但不幼态的圆角矩形为主。7px 用于状态芯片，8–10px 用于小型控件，12px 用于导航与局部容器，14–16px 用于面板和工作区，19px 仅用于创建页的主提示输入。头像、播放按钮与状态点使用圆形，形成少量有意义的节奏变化。

边框通常为 1px 冷灰水线；新建卡片使用虚线表达“尚未存在”，选中节点通过青玉边框或 3px 内侧强调线表明当前上下文。不要将所有元素统一成同一大圆角。

**The Radius Follows Scale Rule.** 元素越小，圆角越收敛；大圆角只属于真正的大容器或沉浸式输入。

## Components

### Buttons

- **Shape:** 紧凑、稳定的圆角矩形（10px），常规高度 40px，水平内边距 15px。
- **Primary:** 青玉底、宣纸白字与轻微青色阴影；用于创建、保存、通过等唯一主动作。
- **Hover / Focus:** 悬停转为深潭青并略微抬升阴影；键盘焦点使用 3px 半透明青玉外轮廓，按下缩放至 0.98。
- **Secondary:** 白底、水线边框与石灰字；悬停仅加深边框和微调背景。
- **Icon:** 38–40px 方形点击面，边框明确；圆形按钮只用于播放或头像语义。

### Chips

- **Style:** 7px 圆角、5px × 8px 内边距、11px 半粗体，并以 6px 圆点辅助传达状态。
- **State:** 生成、审核、通过、草稿与驳回各用低饱和底色和深色文字；不能只靠底色区分。

### Cards / Containers

- **Corner Style:** 项目卡片为 15px，通用面板为 14px，复合工作区为 16px。
- **Background:** 主体为宣纸白；辅助分组使用薄雾面或极淡青绿色。
- **Shadow Strategy:** 默认低对比，悬停时上移 2–4px 并切换为环境抬升阴影。
- **Border:** 始终保留 1px 水线；活动卡片使用青玉或更深水线。
- **Internal Padding:** 紧凑组件 14–16px，表单和大面板 19–24px。

### Inputs / Fields

- **Style:** 白色或薄雾底、1px 水线、8–10px 圆角；紧凑表单高度 34–40px。
- **Focus:** 去除浏览器默认轮廓，改用青玉边界加 3px 半透明焦点环；大型提示输入同时增强环境阴影。
- **Error / Disabled:** 错误使用朱砂红语义并保留文字说明；禁用态降低不透明度、移除阴影并保持可读。

### Navigation

左侧导航项高度 46px、12px 圆角。默认使用石灰字与透明背景，悬停出现薄雾背景并轻微右移，活动态使用薄荷雾背景、深潭青文字和 600 字重。900px 以下导航改为 226px 抽屉并使用暗色半透明遮罩；顶部保留紧凑菜单入口。

### Workflow Nodes

节点卡片以图标、标题、状态和进度构成可扫描单元。默认边界低调，悬停或选中时上移 2px；选中态额外使用青玉内描边，确保当前编辑上下文不只由阴影表达。

### Prompt Composer

创建页的提示输入是系统唯一被允许显著“漂浮”的组件：19px 圆角、半透明白色表面、20px 背景模糊与更深的雾境阴影。内部参数动作保持 11px 紧凑芯片形式，提交按钮维持青玉单主操作。

## Do's and Don'ts

### Do:

- **Do** 用矿物青玉统一主要操作、选中、进度和键盘焦点。
- **Do** 用边框、文字和图形共同表达状态，确保语义不依赖颜色。
- **Do** 在桌面保留高密度、可追溯的工作区，在 900px 与 680px 两级有计划地重排。
- **Do** 只在创建入口、影像预览和品牌时刻使用江南山水与雾化玻璃。
- **Do** 为所有动画保留 `prefers-reduced-motion` 降级。

### Don't:

- **Don't** 引入第二种高饱和品牌色与青玉争夺主操作层级。
- **Don't** 把审核、表单或设置区域铺成半透明玻璃，削弱文字和证据的清晰度。
- **Don't** 给每个分组添加明显阴影；常规结构首先依靠白面、雾面和水线。
- **Don't** 使用通用霓虹渐变、纯黑大底或过度圆润的消费级卡通样式。
- **Don't** 为了移动端简化而隐藏状态、来源、版本或审核动作。
