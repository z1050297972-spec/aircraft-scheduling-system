# 3D 模型功能 - 真实数据接入指南

> 本文档标注了 3D 模型查看器中需要在接入真实后端数据时修改的所有位置。

---

## 一、需要修改的文件清单

| 文件 | 修改内容 | 优先级 |
|------|---------|--------|
| `data/mockPartStatus.ts` | 替换为 API 调用 | 🔴 高 |
| `hooks/usePartStatus.ts` | 添加异步数据获取 | 🔴 高 |
| `data/modelRegistry.ts` | 更换模型路径和机型列表 | 🔴 高 |
| `data/meshMapping.ts` | 根据新模型调整 Mesh 映射 | 🔴 高 |
| `public/models/` | 替换 GLB 模型文件 | 🔴 高 |
| `ModelViewerPage.tsx` | 添加加载状态处理 | 🟡 中 |
| `PartInfoPanel.tsx` | 扩展故障信息字段 | 🟡 中 |

---

## 二、详细修改指南

### 1. 替换模拟故障数据 → API 调用

**文件:** `src/features/model-viewer/data/mockPartStatus.ts`

**当前代码 (模拟数据):**
```typescript
// ❌ 需要删除的模拟数据
export const MOCK_PART_STATUS: PartStatus[] = [
  {
    partId: 'engine-left',
    status: 'error',
    faults: [
      {
        id: 'f001',
        type: '温度传感器异常',
        severity: 'high',
        description: '左发动机涡轮区域温度传感器读数超出正常范围',
        detectedAt: '2025-01-15T08:30:00Z',
        recommendation: '建议立即停机检查，更换传感器'
      }
    ]
  },
  // ...
];
```

**替换为:**
```typescript
// ✅ 创建新文件: src/features/model-viewer/services/partStatusApi.ts

import { PartStatus } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 获取指定飞机的所有部件状态
 */
export const fetchAircraftPartStatus = async (
  aircraftId: string
): Promise<PartStatus[]> => {
  const response = await fetch(
    `${API_BASE_URL}/aircraft/${aircraftId}/parts/status`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch part status');
  }

  return response.json();
};

/**
 * 获取单个部件的详细状态
 */
export const fetchPartDetail = async (
  aircraftId: string,
  partId: string
): Promise<PartStatus> => {
  const response = await fetch(
    `${API_BASE_URL}/aircraft/${aircraftId}/parts/${partId}/status`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch part detail');
  }

  return response.json();
};
```

---

### 2. 修改 usePartStatus Hook

**文件:** `src/features/model-viewer/hooks/usePartStatus.ts`

**当前代码:**
```typescript
// ❌ 当前使用静态模拟数据
import { MOCK_PART_STATUS } from '../data/mockPartStatus';

export const usePartStatus = () => {
  const getPartStatus = (partId: string): PartStatus | null => {
    return MOCK_PART_STATUS.find((s) => s.partId === partId) ?? null;
  };
  // ...
};
```

**替换为:**
```typescript
// ✅ 改为异步数据获取
import { useState, useEffect, useCallback } from 'react';
import { PartStatus } from '@/types';
import { fetchAircraftPartStatus } from '../services/partStatusApi';

export interface UsePartStatusReturn {
  partStatusList: PartStatus[];
  isLoading: boolean;
  error: Error | null;
  getPartStatus: (partId: string) => PartStatus | null;
  refreshStatus: () => Promise<void>;
}

export const usePartStatus = (aircraftId: string): UsePartStatusReturn => {
  const [partStatusList, setPartStatusList] = useState<PartStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!aircraftId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAircraftPartStatus(aircraftId);
      setPartStatusList(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [aircraftId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const getPartStatus = useCallback(
    (partId: string): PartStatus | null => {
      return partStatusList.find((s) => s.partId === partId) ?? null;
    },
    [partStatusList]
  );

  return {
    partStatusList,
    isLoading,
    error,
    getPartStatus,
    refreshStatus: fetchStatus,
  };
};
```

---

### 3. 更换飞机模型

**目录:** `public/models/`

**当前模型 (来自 FlightAirMap):**
```
public/models/
├── boeing-737/scene.glb      # Boeing 747 模型
├── airbus-a320/scene.glb     # Airbus A320 模型
└── generic-airliner/scene.glb # Boeing 787 模型
```

**替换步骤:**

1. **准备新模型文件**
   - 格式要求: **glTF 2.0 / GLB**
   - 确保模型已按部件分割为独立 Mesh
   - 每个 Mesh 需要有明确的命名

2. **放置模型文件**
   ```bash
   public/models/
   ├── your-aircraft-1/scene.glb
   ├── your-aircraft-2/scene.glb
   └── your-aircraft-3/scene.glb
   ```

3. **获取 Mesh 名称列表**
   - 在浏览器控制台查看自动输出的 Mesh 信息
   - 或使用 Blender 打开模型查看对象名称

---

### 4. 更新机型注册表

**文件:** `src/features/model-viewer/data/modelRegistry.ts`

**当前代码:**
```typescript
// ❌ 硬编码的机型列表
export const MODEL_REGISTRY: AircraftModelType[] = [
  {
    id: 'boeing-737',
    name: 'Boeing 737-800',
    modelPath: '/models/boeing-737/scene.glb',
    parts: [/* ... */],
  },
  // ...
];
```

**替换为:**
```typescript
// ✅ 方案 A: 从后端动态获取机型列表
// 创建新文件: src/features/model-viewer/services/modelApi.ts

export const fetchAvailableModels = async (): Promise<AircraftModelType[]> => {
  const response = await fetch(`${API_BASE_URL}/aircraft/models`);
  return response.json();
};

// ✅ 方案 B: 保持静态配置但更新内容
export const MODEL_REGISTRY: AircraftModelType[] = [
  {
    id: 'your-aircraft-id',           // 🔄 更改
    name: '您的飞机名称',               // 🔄 更改
    modelPath: '/models/xxx/scene.glb', // 🔄 更改
    parts: [/* 根据新模型更新 */],       // 🔄 更改
  },
];
```

---

### 5. 更新 Mesh 名称映射

**文件:** `src/features/model-viewer/data/meshMapping.ts`

**当前代码:**
```typescript
// ❌ 针对当前模型的映射
export const PART_MAPPINGS: PartMapping[] = [
  {
    id: 'engine-1',
    name: '1号发动机',
    category: 'engine',
    meshPatterns: ['eng1_', 'Blades003', 'engine_body_0003', ...],
  },
  // ...
];
```

**修改步骤:**

1. **加载新模型后，查看控制台输出的 Mesh 名称列表**

2. **根据新模型的 Mesh 命名规则更新映射:**
   ```typescript
   export const PART_MAPPINGS: PartMapping[] = [
     {
       id: 'engine-left',              // 保持业务 ID 不变
       name: '左发动机',                // 保持显示名称不变
       category: 'engine',             // 保持类别不变
       meshPatterns: [
         'your_new_mesh_name_1',       // 🔄 更改为新模型的 Mesh 名称
         'your_new_mesh_name_2',
       ],
     },
     // ...
   ];
   ```

3. **如果不同机型有不同的 Mesh 命名，创建多个映射:**
   ```typescript
   export const MODEL_MESH_MAPPINGS: Record<string, PartMapping[]> = {
     'aircraft-type-a': [...],
     'aircraft-type-b': [...],
   };
   ```

---

### 6. 添加加载状态处理

**文件:** `src/features/model-viewer/ModelViewerPage.tsx`

**需要添加:**
```typescript
// ✅ 添加加载和错误状态
const { partStatusList, isLoading, error, getPartStatus, refreshStatus } =
  usePartStatus(selectedModelId);

// 在 UI 中显示加载状态
{isLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
)}

// 显示错误状态
{error && (
  <div className="text-red-500 text-center p-4">
    加载失败: {error.message}
    <button onClick={refreshStatus}>重试</button>
  </div>
)}
```

---

### 7. 扩展故障信息字段

**文件:** `src/types/model-viewer.ts`

**当前类型:**
```typescript
interface FaultInfo {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  recommendation?: string;
}
```

**根据后端 API 扩展:**
```typescript
// ✅ 根据实际后端数据结构扩展
interface FaultInfo {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  recommendation?: string;

  // 🔄 新增字段 (根据后端 API)
  faultCode?: string;           // 故障代码
  affectedSystems?: string[];   // 受影响的系统
  estimatedRepairTime?: number; // 预估修复时间 (分钟)
  assignedTechnician?: string;  // 负责技术员
  workOrderId?: string;         // 工单 ID
  attachments?: string[];       // 相关附件 URL
}
```

---

## 三、环境变量配置

**文件:** `.env.local` (新建)

```bash
# API 配置
VITE_API_BASE_URL=https://your-backend-api.com/api

# 模型 CDN (可选，如果模型托管在 CDN)
VITE_MODEL_CDN_URL=https://cdn.example.com/models
```

**文件:** `.env.example` (模板)

```bash
# API 配置
VITE_API_BASE_URL=http://localhost:8080/api

# 模型 CDN (可选)
VITE_MODEL_CDN_URL=
```

---

## 四、后端 API 接口规范建议

### 获取机型列表

```
GET /api/aircraft/models

Response:
[
  {
    "id": "boeing-737-800",
    "name": "Boeing 737-800",
    "modelPath": "/models/boeing-737/scene.glb",
    "thumbnail": "/thumbnails/boeing-737.jpg"
  }
]
```

### 获取部件状态

```
GET /api/aircraft/{aircraftId}/parts/status

Response:
[
  {
    "partId": "engine-left",
    "status": "error",
    "faults": [
      {
        "id": "f001",
        "type": "温度传感器异常",
        "severity": "high",
        "description": "...",
        "detectedAt": "2025-01-15T08:30:00Z",
        "recommendation": "..."
      }
    ]
  }
]
```

### WebSocket 实时更新 (可选)

```
WS /ws/aircraft/{aircraftId}/status

Message:
{
  "type": "PART_STATUS_UPDATE",
  "partId": "engine-left",
  "status": "warning",
  "timestamp": "2025-01-15T08:35:00Z"
}
```

---

## 五、修改检查清单

在接入真实数据前，请确认以下项目：

- [ ] 后端 API 已就绪并可访问
- [ ] 新的 GLB 模型文件已准备好
- [ ] 模型已按部件分割并正确命名
- [ ] 环境变量已配置
- [ ] `meshMapping.ts` 已根据新模型更新
- [ ] `modelRegistry.ts` 已更新机型信息
- [ ] `usePartStatus.ts` 已改为异步获取
- [ ] 加载/错误状态 UI 已添加
- [ ] 类型定义已根据 API 响应更新

---

## 六、测试验证

1. **模型加载测试**
   - 新模型能否正常加载？
   - 控制台是否有 Mesh 名称输出？

2. **点击检测测试**
   - 点击各部件是否正确识别？
   - Mesh 映射是否准确？

3. **状态显示测试**
   - API 数据是否正确获取？
   - 故障状态颜色是否正确显示？

4. **错误处理测试**
   - API 失败时是否显示错误信息？
   - 重试功能是否正常？

---

*最后更新: 2025-01*
