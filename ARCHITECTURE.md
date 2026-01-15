# Aircraft 项目架构文档

> 飞机调度测试用例生成系统

---

## 一、项目概述

Aircraft 是一个用于航空地面保障的**测试用例智能生成系统**，提供飞机状态监控、AI 驱动的测试用例生成、用例库管理和 3D 飞机模型可视化等功能。

### 核心功能

| 功能模块 | 描述 |
|---------|------|
| **态势监控** | 实时展示机队状态，快速定位问题飞机 |
| **智能生成** | AI 驱动的测试用例自动生成 |
| **用例库** | 测试用例的存储、检索、编辑和管理 |
| **3D 模型** | 飞机 3D 可视化与故障部件标注 |

---

## 二、整体架构

### 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                                │
│                    (AppProvider 包装)                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                      MainLayout                              ││
│  │  ┌──────────┐  ┌────────────────────────────────────────┐   ││
│  │  │ Sidebar  │  │              内容区域                    │   ││
│  │  │          │  │  ┌────────────────────────────────────┐│   ││
│  │  │ 态势监控 │  │  │ Dashboard / Generator / Library /  ││   ││
│  │  │ 智能生成 │  │  │ ModelViewer (3D)                   ││   ││
│  │  │ 用例库   │  │  └────────────────────────────────────┘│   ││
│  │  │ 3D 模型  │  │                                        │   ││
│  │  └──────────┘  └────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 技术特点

| 特点 | 说明 |
|------|------|
| 单页应用 | React SPA，无页面刷新 |
| 状态集中管理 | AppContext 管理全局状态 |
| 功能模块化 | features/ 目录按功能划分 |
| 响应式设计 | 支持桌面和移动端 |
| 3D 可视化 | React Three Fiber 实现 |

---

## 三、技术栈

### 核心框架

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | React | 18.3.x | UI 框架 |
| **语言** | TypeScript | 5.7.x | 类型安全 |
| **构建工具** | Vite | 6.x | 快速构建 |
| **样式** | Tailwind CSS | 3.x | 原子化 CSS |
| **UI 图标** | lucide-react | latest | 图标库 |
| **图表** | recharts | latest | 数据可视化 |

### 3D 渲染

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **3D 框架** | React Three Fiber | 8.x | React 风格 3D |
| **3D 工具库** | @react-three/drei | 9.x | 常用 3D 组件 |
| **3D 引擎** | Three.js | 0.169.x | WebGL 渲染 |
| **模型格式** | glTF 2.0 / GLB | - | 3D 模型格式 |

### 代码质量

| 类别 | 技术 | 用途 |
|------|------|------|
| **Linting** | ESLint | 代码检查 |
| **Formatting** | Prettier | 代码格式化 |
| **Git Hooks** | Husky + lint-staged | 提交前检查 |

**开发服务器端口:** 3000

---

## 四、目录结构

```
aircraft/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── ARCHITECTURE.md               # 本文档
│
├── public/
│   └── models/                   # 3D 模型文件
│       ├── boeing-737/scene.glb
│       ├── airbus-a320/scene.glb
│       └── generic-airliner/scene.glb
│
├── docs/
│   └── 3D-MODEL-INTEGRATION-GUIDE.md  # 真实数据接入指南
│
└── src/
    ├── main.tsx                  # 应用入口
    ├── App.tsx                   # 根组件
    │
    ├── components/               # 全局共享组件
    │   ├── index.ts
    │   └── AircraftDetailModal.tsx
    │
    ├── layouts/                  # 布局组件
    │   └── MainLayout.tsx
    │
    ├── features/                 # 功能模块 ⭐
    │   ├── dashboard/            # 态势监控模块
    │   ├── generator/            # 智能生成模块
    │   ├── library/              # 用例库模块
    │   └── model-viewer/         # 3D 模型模块
    │
    ├── shared/                   # 共享资源
    │   ├── index.ts              # 统一导出
    │   ├── contexts/
    │   │   ├── index.ts
    │   │   └── AppContext.tsx    # 全局状态管理
    │   ├── hooks/
    │   │   └── index.ts
    │   ├── utils/
    │   │   ├── index.ts
    │   │   ├── formatters.ts     # 日期/数字格式化
    │   │   └── validators.ts     # 输入验证
    │   ├── services/
    │   │   ├── index.ts
    │   │   └── apiClient.ts      # API 客户端配置
    │   └── constants/
    │       ├── index.ts
    │       └── config.ts
    │
    ├── types/                    # 全局类型定义
    │   ├── index.ts
    │   └── common.ts
    │
    └── data/                     # 静态/模拟数据
        ├── index.ts
        └── mockData.ts
```

### 4.1 共享资源 (Shared) 详解

**目录:** `src/shared/`

**工具函数 (utils/):**

| 模块 | 函数 | 用途 |
|------|------|------|
| **formatters.ts** | `formatDateCN(date)` | 格式化日期为中文格式 |
| | `formatNumber(num)` | 添加千位分隔符 |
| | `formatPercentage(value, decimals)` | 格式化百分比 |
| **validators.ts** | `sanitizeInput(input, maxLength)` | 清理用户输入 |
| | `isNotEmpty(value)` | 检查非空字符串 |
| | `isRequired(value)` | 验证必填字段 |

**API 客户端 (services/apiClient.ts):**

```typescript
// API 配置
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
};

// 通用请求封装
export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>>;
```

> **TODO:** 后续接入自研大模型后端时，在此配置 API 基础设置

---

## 五、功能模块详解

### 5.1 态势监控 (Dashboard)

**目录:** `src/features/dashboard/`

**功能描述:**
- 以网格形式展示机队中所有飞机的状态
- 支持按状态筛选（正常、警告、故障、维护中）
- 点击飞机卡片查看详细信息弹窗
- 响应式布局，适配不同屏幕尺寸

**文件结构:**
```
features/dashboard/
├── AircraftGrid.tsx      # 飞机网格展示组件
├── Sidebar.tsx           # 桌面端侧边栏导航
├── MobileDrawer.tsx      # 移动端抽屉式导航
└── LoginView.tsx         # 登录页面
```

**核心组件:**

| 组件 | 职责 |
|------|------|
| **AircraftGrid** | 渲染飞机卡片网格，支持状态筛选和搜索 |
| **Sidebar** | 桌面端固定侧边栏，包含导航菜单和用户信息 |
| **MobileDrawer** | 移动端滑出式导航抽屉 |
| **LoginView** | 用户登录界面，包含用户名/密码表单 |

**数据流:**
```
MOCK_AIRCRAFT (模拟数据)
       │
       ▼
AircraftGrid
       │
       ├── 渲染飞机卡片列表
       │
       └── 点击卡片 → 打开 AircraftDetailModal
```

---

### 5.2 智能生成 (Generator)

**目录:** `src/features/generator/`

**功能描述:**
- 用户输入测试需求描述（自然语言）
- AI 模型分析需求并生成测试场景
- 支持选择关联飞机进行针对性测试
- 生成过程包含 4 阶段加载动画反馈
- 可预览、编辑和保存生成的测试用例

**文件结构:**
```
features/generator/
├── index.ts                        # 模块导出
├── TestCaseGenerator.tsx           # 生成器主组件
├── components/
│   ├── index.ts
│   ├── GeneratorInputPanel.tsx     # 左侧输入面板
│   └── GeneratorResultPanel.tsx    # 右侧结果面板
├── hooks/
│   ├── index.ts
│   └── useGenerator.ts             # 生成器状态管理 Hook
└── services/
    ├── index.ts
    └── generatorApi.ts             # AI 接口层（预留后端接入）
```

**核心组件:**

| 组件 | 职责 |
|------|------|
| **TestCaseGenerator** | 生成器容器，协调输入和输出 |
| **GeneratorInputPanel** | 需求输入区域，包含文本框和飞机选择器 |
| **GeneratorResultPanel** | 结果展示区域，显示生成的场景和任务 |

**核心 Hook:**

```typescript
// useGenerator.ts
interface UseGeneratorReturn {
  userInput: string;                    // 用户输入文本
  setUserInput: (input: string) => void;
  selectedAircraftIds: string[];        // 选中的飞机 ID
  toggleAircraftSelection: (id: string) => void;
  isGenerating: boolean;                // 生成中状态
  loadingStep: number;                  // 当前加载阶段 (0-3)
  loadingTexts: string[];               // 加载阶段描述文本
  scenario: GeneratedScenario | null;   // 生成结果
  hasSaved: boolean;                    // 已保存标记
  handleGenerate: () => Promise<void>;  // 触发生成
  handleSaveClick: () => void;          // 保存到用例库
}
```

**API 服务层:**

```typescript
// services/generatorApi.ts
// TODO: 后续接入自研大模型后端 API

// 生成测试用例
export const generateTestCase = async (
  userInput: string,
  aircraftList: Aircraft[]
): Promise<GeneratedScenario | null>;

// AI 优化需求描述
export const optimizeScenarioDescription = async (
  input: string
): Promise<string>;
```

**加载动画阶段:**

| 阶段 | 显示文本 |
|------|----------|
| 0 | 正在分析态势感知数据... |
| 1 | 正在检索可用保障资源... |
| 2 | 正在推演最优调度路径... |
| 3 | 正在生成仿真评估报告... |

**数据流:**
```
用户输入需求 + 选择飞机
       │
       ▼
GeneratorInputPanel
       │
       ▼
useGenerator.handleGenerate()
       │
       ▼
generatorApi.generateTestCase()  ← TODO: 接入后端
       │
       ▼
GeneratedScenario
       │
       ▼
GeneratorResultPanel
       │
       └── handleSaveClick() → AppContext.saveTestCase()
```

**生成结果类型:**
```typescript
interface GeneratedScenario {
  scenarioName: string;        // 场景名称
  tasks: GeneratedTask[];      // 任务列表
  predictedOutcome: {          // 预测结果
    isComplete: boolean;
    totalTime: number;
    score: number;
    grade: string;
    logs: string[];
    resourceUsage: ResourceUsage[];
  };
}

interface GeneratedTask {
  id: string;
  aircraftId: string;          // 关联飞机
  type: string;                // 任务类型
  description: string;         // 任务描述
  requiredResources: string;   // 所需资源
  estimatedDuration: number;   // 预计时长（分钟）
}
```

---

### 5.3 用例库 (Library)

**目录:** `src/features/library/`

**功能描述:**
- 展示所有已保存的测试用例
- 支持搜索、筛选和排序
- 创建新用例（手动或从需求生成）
- 编辑、删除和加载已有用例
- 标签系统方便分类管理

**文件结构:**
```
features/library/
├── TestCaseLibrary.tsx             # 用例库主组件
├── hooks/
│   └── useCaseModal.ts             # 弹窗状态管理
└── components/
    ├── LibraryHeader.tsx           # 顶部搜索和操作栏
    ├── CaseCard.tsx                # 用例卡片组件
    └── CaseModals.tsx              # 创建/编辑弹窗
```

**核心组件:**

| 组件 | 职责 |
|------|------|
| **TestCaseLibrary** | 用例库容器，管理列表和操作 |
| **LibraryHeader** | 搜索框、筛选器和"新建"按钮 |
| **CaseCard** | 单个用例卡片，显示名称、标签、创建时间 |
| **CreateCaseModal** | 新建用例弹窗，支持需求输入和 AI 优化 |
| **EditCaseModal** | 编辑用例弹窗，修改名称和标签 |

**核心 Hook:**
```typescript
// useCaseModal.ts
interface UseCaseModalReturn {
  // 创建弹窗状态
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  createName: string;
  createTags: string;
  createRequirement: string;
  isOptimizing: boolean;
  handleOptimize: () => Promise<void>;
  handleCreateCase: (onNavigate: (prompt: string) => void) => void;

  // 编辑弹窗状态
  editingCase: SavedTestCase | null;
  editName: string;
  editTags: string;
  handleOpenEditModal: (testCase: SavedTestCase) => void;
  handleCloseEditModal: () => void;
  handleSaveEditCase: (updateFn: (updated: SavedTestCase) => void) => void;
}
```

**数据流:**
```
AppContext.savedCases
       │
       ▼
TestCaseLibrary
       │
       ├── LibraryHeader (搜索/筛选)
       │
       ├── CaseCard[] (列表渲染)
       │       │
       │       ├── 加载 → 跳转 Generator 并预填充
       │       ├── 编辑 → 打开 EditCaseModal
       │       └── 删除 → AppContext.deleteTestCase()
       │
       └── CreateCaseModal
               │
               └── 创建 → 跳转 Generator
```

---

### 5.4 3D 模型查看器 (Model Viewer)

**目录:** `src/features/model-viewer/`

**功能描述:**
- 3D 飞机模型可视化展示
- 支持多机型切换（下拉选择）
- 点击部件精确识别（基于 Mesh 名称）
- 选中部件高亮发光，其他部件透明
- 显示部件故障状态和详细信息
- 线框视图和标签视图可切换
- 颜色编码显示健康状态（绿/黄/红/蓝）
- 响应式设计，支持触摸控制

**文件结构:**
```
features/model-viewer/
├── index.ts                        # 模块导出
├── ModelViewerPage.tsx             # 页面主组件
│
├── components/
│   ├── index.ts
│   ├── AircraftScene.tsx           # 3D 场景容器
│   ├── AircraftModel.tsx           # 飞机模型组件
│   ├── MeshOverlay.tsx             # 线框和标签覆盖层
│   ├── ModelSelector.tsx           # 机型选择器
│   ├── PartInfoPanel.tsx           # 故障详情面板
│   ├── LoadingProgress.tsx         # 加载进度指示器
│   └── RegionHighlight.tsx         # 区域高亮（旧方案）
│
├── hooks/
│   ├── index.ts
│   ├── usePartSelection.ts         # 部件选择状态
│   └── usePartStatus.ts            # 部件健康状态
│
└── data/
    ├── index.ts
    ├── modelRegistry.ts            # 机型注册表
    ├── meshMapping.ts              # Mesh→部件映射
    ├── mockPartStatus.ts           # 模拟故障数据
    └── partRegions.ts              # 边界框定义（旧方案）
```

**核心组件:**

| 组件 | 职责 |
|------|------|
| **ModelViewerPage** | 页面容器，状态管理，UI 布局 |
| **AircraftScene** | 3D Canvas 容器，灯光、环境、控制器 |
| **AircraftModel** | 模型加载、点击检测、高亮效果 |
| **MeshOverlay** | 线框渲染、部件标签 |
| **PartInfoPanel** | 右侧故障信息面板 |
| **ModelSelector** | 机型下拉选择器 |

**核心 Hooks:**

| Hook | 职责 |
|------|------|
| **usePartSelection** | 管理选中部件 ID 和信息 |
| **usePartStatus** | 查询部件健康状态 |

**Mesh 与 Part 的关系:**
```
                1号发动机 (Part)
                     │
    ┌────────────────┼────────────────┐
    │                │                │
engine_body     Blades003        Cone003
  (Mesh)          (Mesh)          (Mesh)
```

**部件映射配置:**
```typescript
// meshMapping.ts
export const PART_MAPPINGS: PartMapping[] = [
  {
    id: 'engine-1',
    name: '1号发动机',
    category: 'engine',
    meshPatterns: ['eng1_', 'Blades003', 'engine_body_0003', ...],
  },
  // ... 共 18 个部件定义
];
```

**完整部件列表:**

| 部件 ID | 名称 | 类别 | Mesh 模式示例 |
|---------|------|------|---------------|
| cockpit | 驾驶舱 | cockpit | cockpit, nosecone, RHwiper |
| fuselage | 机身 | fuselage | fuselage, lav, cargodoor |
| wing-left | 左机翼 | wing | wing_left, winglet_left |
| wing-right | 右机翼 | wing | wing_right, winglet_right |
| flap-left | 左襟翼 | wing | flap_left |
| flap-right | 右襟翼 | wing | flap_right |
| aileron-left | 左副翼 | wing | aileron_left |
| aileron-right | 右副翼 | wing | aileron_right |
| speedbrake-left | 左扰流板 | wing | speedbrake_left |
| speedbrake-right | 右扰流板 | wing | speedbrake_right |
| engine-1 | 1号发动机 | engine | eng1_, Blades003, Cone003 |
| engine-2 | 2号发动机 | engine | eng2_, Blades002, Cone002 |
| engine-3 | 3号发动机 | engine | eng3_, Blades001, Cone001 |
| engine-4 | 4号发动机 | engine | eng4_, Blades, Cone |
| tail-vertical | 垂直尾翼 | tail | vstab, rudder |
| tail-horizontal | 水平尾翼 | tail | hstab, elevator |
| landing-gear-nose | 前起落架 | landing-gear | nlg_ |
| landing-gear-main | 主起落架 | landing-gear | wlg_ |

**MeshOverlay 组件:**

负责在 3D 模型上渲染可视化覆盖层：

```typescript
interface MeshOverlayProps {
  scene: THREE.Object3D;       // 3D 场景对象
  showWireframe: boolean;      // 是否显示线框
  showLabels: boolean;         // 是否显示标签
  getPartStatus: (partId: string) => PartStatus | null;
}
```

| 功能 | 说明 |
|------|------|
| **线框渲染** | 使用 EdgesGeometry 生成边缘线，颜色根据健康状态变化 |
| **部件标签** | 使用 @react-three/drei 的 Html 组件在 3D 空间中显示标签 |
| **颜色编码** | 根据 PartStatus 动态设置颜色（正常绿/警告黄/故障红/维护蓝） |

**健康状态颜色:**

| 状态 | 颜色 | 含义 |
|------|------|------|
| normal | 🟢 绿色 | 正常运行 |
| warning | 🟡 琥珀色 | 需要关注 |
| error | 🔴 红色 | 需要维修 |
| maintenance | 🔵 蓝色 | 维护中 |

**数据流:**
```
用户点击飞机模型
       │
       ▼
AircraftModel.handleClick(event)
       │
       ▼
event.object.name → "engine_body_0003"
       │
       ▼
meshMapping.findPartByMeshName()
       │
       ▼
匹配部件 → { id: "engine-1", name: "1号发动机" }
       │
       ▼
onPartClick(partId, partName)
       │
       ▼
usePartSelection.selectPart()
       │
       ├──→ 更新 selectedPartId
       │
       └──→ 触发高亮效果
            │
            ├── 选中部件: emissive 发光
            └── 其他部件: opacity 透明
```

---

## 六、数据流设计

### 全局状态 (AppContext)

```typescript
interface AppContextValue {
  // 视图状态
  view: ViewState;
  setView: (view: ViewState) => void;

  // 认证状态
  username: string;
  setUsername: (name: string) => void;
  password: string;
  setPassword: (pass: string) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // 测试用例状态
  savedCases: SavedTestCase[];
  saveTestCase: (scenario: GeneratedScenario) => void;
  deleteTestCase: (id: string) => void;
  updateTestCase: (updatedCase: SavedTestCase) => void;

  // 导航状态
  currentScenario: GeneratedScenario | null;
  setCurrentScenario: (scenario: GeneratedScenario | null) => void;
  initialPrompt: string;
  setInitialPrompt: (prompt: string) => void;

  // 移动端菜单
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}
```

### 状态流转图

```
┌─────────────────────────────────────────────────────────────────┐
│                       AppContext                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   视图状态    │  │   认证状态    │  │     用例状态          │  │
│  │  view        │  │  username    │  │  savedCases          │  │
│  │  setView     │  │  password    │  │  saveTestCase        │  │
│  │              │  │  login       │  │  deleteTestCase      │  │
│  │              │  │  logout      │  │  updateTestCase      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   MainLayout    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   Dashboard            Generator             Library
   (只读展示)           (生成+保存)          (CRUD 操作)
```

---

## 七、组件职责划分

### 核心组件

| 组件 | 文件 | 职责 |
|------|------|------|
| **App** | `App.tsx` | 根组件，AppProvider 包装 |
| **AppContext** | `shared/contexts/AppContext.tsx` | 全局状态管理 |
| **MainLayout** | `layouts/MainLayout.tsx` | 主布局，视图路由 |

### 共享组件

| 组件 | 文件 | 职责 |
|------|------|------|
| **AircraftDetailModal** | `components/AircraftDetailModal.tsx` | 飞机详情弹窗 |

### 功能模块组件

见各功能模块详解章节。

---

## 八、关键文件关系图

```
App.tsx
    │
    └─→ AppProvider (AppContext.tsx)
            │
            └─→ AppContent
                    │
                    ├─→ LoginView (未登录)
                    │       └── 登录表单 → login()
                    │
                    └─→ MainLayout (已登录)
                            │
                            ├─→ Sidebar / MobileDrawer
                            │       └── 导航菜单 → setView()
                            │
                            └─→ 视图内容 (根据 view 切换)
                                │
                                ├─→ Dashboard
                                │       └── AircraftGrid
                                │               └── AircraftDetailModal
                                │
                                ├─→ Generator
                                │       ├── GeneratorInputPanel
                                │       └── GeneratorResultPanel
                                │               └── saveTestCase()
                                │
                                ├─→ Library
                                │       ├── LibraryHeader
                                │       ├── CaseCard[]
                                │       ├── CreateCaseModal
                                │       └── EditCaseModal
                                │
                                └─→ ModelViewer
                                        ├── ModelSelector
                                        ├── AircraftScene
                                        │       └── AircraftModel
                                        │               └── MeshOverlay
                                        └── PartInfoPanel
```

---

## 九、类型定义

### 视图类型

```typescript
type ViewState = 'login' | 'dashboard' | 'generator' | 'library' | 'model-viewer';
```

### 飞机类型

```typescript
interface Aircraft {
  id: string;
  model: string;
  registration: string;
  status: 'normal' | 'warning' | 'error' | 'maintenance';
  location: string;
  lastCheck: string;
  nextMaintenance: string;
  flightHours: number;
  fuelLevel: number;
}
```

### 测试用例类型

```typescript
interface SavedTestCase extends GeneratedScenario {
  id: string;
  createdAt: string;
  tags: string[];
}

interface GeneratedScenario {
  scenarioName: string;
  description: string;
  tasks: GeneratedTask[];
  constraints?: string[];
  expectedOutcome?: string;
}

interface GeneratedTask {
  id: string;
  aircraftId: string;
  taskType: string;
  priority: 'high' | 'medium' | 'low';
  duration: number;
  dependencies?: string[];
  steps: TaskStep[];
}
```

### 3D 模型类型

```typescript
interface AircraftModelType {
  id: string;
  name: string;
  modelPath: string;
  thumbnailPath?: string;
  parts: PartDefinition[];
}

interface PartDefinition {
  id: string;
  name: string;
  meshNames: string[];
  category: PartCategory;
}

type PartCategory = 'engine' | 'wing' | 'fuselage' | 'tail' | 'landing-gear' | 'cockpit' | 'other';

interface PartStatus {
  partId: string;
  status: 'normal' | 'warning' | 'error' | 'maintenance';
  faults: FaultInfo[];
}

interface FaultInfo {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  recommendation?: string;
}
```

---

## 十、开发命令

```bash
npm run dev       # 启动开发服务器 (端口 3000)
npm run build     # 生产构建
npm run preview   # 预览构建结果
npm run lint      # ESLint 检查
npm run lint:fix  # ESLint 自动修复
npm run format    # Prettier 格式化
npm run typecheck # TypeScript 类型检查
```

---

## 十一、后续开发指南

### 接入真实后端

本项目预留了完整的后端接入架构，主要涉及以下文件：

#### AI 测试用例生成后端

| 文件 | 当前状态 | 接入后端需修改内容 |
|------|----------|-------------------|
| `features/generator/services/generatorApi.ts` | 模拟数据 | 替换为实际 API 调用 |
| `features/library/hooks/useCaseModal.ts` | 模拟优化 | 接入 AI 优化接口 |
| `shared/services/apiClient.ts` | 基础配置 | 配置认证头、错误处理 |

**环境变量配置:**
```bash
# .env.local
VITE_API_BASE_URL=https://your-backend-api.com/api
```

#### 3D 模型故障数据后端

详见 `docs/3D-MODEL-INTEGRATION-GUIDE.md`

| 文件 | 当前状态 | 接入后端需修改内容 |
|------|----------|-------------------|
| `features/model-viewer/data/mockPartStatus.ts` | 模拟故障数据 | 删除，改用 API |
| `features/model-viewer/hooks/usePartStatus.ts` | 静态数据查询 | 改为异步 API 调用 |
| `features/model-viewer/data/modelRegistry.ts` | 静态机型列表 | 可改为动态获取 |

### 添加新功能模块

1. 在 `src/features/` 下创建新目录
2. 遵循现有模块结构（index.ts、主组件、components/、hooks/）
3. 在 `types/common.ts` 中添加新的 ViewState
4. 在 `MainLayout.tsx` 中添加路由渲染
5. 在 Sidebar 中添加导航项

### 模型替换指南

1. 准备 glTF 2.0 / GLB 格式模型
2. 确保模型已按部件分割 Mesh
3. 更新 `modelRegistry.ts` 机型配置
4. 更新 `meshMapping.ts` Mesh 映射
5. 测试点击检测是否准确

---

## 十二、3D 模型资源

### 当前模型来源

| 机型 | 来源 | 许可证 |
|------|------|--------|
| Boeing 747 | [FlightAirMap-3dmodels](https://github.com/Ysurac/FlightAirMap-3dmodels) | MIT |
| Airbus A320 | FlightAirMap-3dmodels | MIT |
| Boeing 787 | FlightAirMap-3dmodels | MIT |

### 模型格式要求

| 项目 | 要求 |
|------|------|
| 格式 | glTF 2.0 / GLB |
| Mesh 分割 | 每个可交互部件应为独立 Mesh |
| Mesh 命名 | 需有意义的命名（如 engine_left, wing_right） |
| 材质 | 支持 PBR 材质 |
| 文件大小 | 建议 < 50MB（优化后） |

### 获取 Mesh 名称

加载新模型后，控制台会自动输出：
```
=== 模型信息 ===
模型路径: /models/xxx/scene.glb
Mesh 数量: 175
尺寸 (x, y, z): [50.23, 15.67, 48.91]
================
```

点击模型时会输出：
```
--- 点击 Mesh ---
Mesh 名称: engine_body_0003
匹配部件: 1号发动机 (engine-1)
```

---

## 十三、性能优化

### 3D 渲染优化

| 优化项 | 实现方式 |
|--------|----------|
| 材质复用 | 克隆材质避免共享问题 |
| 懒加载 | useGLTF 自动处理 |
| 进度指示 | LoadingProgress 组件 |
| 按需渲染 | MeshOverlay 仅在启用时渲染 |

### React 性能

| 优化项 | 实现方式 |
|--------|----------|
| 状态隔离 | 功能模块使用独立 Hook |
| 记忆化 | useMemo / useCallback 优化 |
| 虚拟化 | 用例库大列表可考虑虚拟滚动 |

---

## 十四、调试技巧

### 3D 模型调试

1. **查看 Mesh 结构**: 打开浏览器控制台，加载模型后查看输出
2. **测试点击检测**: 点击模型各部位，观察控制台输出的 Mesh 名称
3. **调整映射规则**: 修改 `meshMapping.ts` 中的 `meshPatterns`

### React 调试

1. **React DevTools**: 查看组件树和 Props
2. **Network Tab**: 检查 API 调用
3. **Console**: 查看日志输出

---

*最后更新: 2025-01*
