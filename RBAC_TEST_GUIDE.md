# RBAC (基于角色的访问控制) 测试指南

## 功能概述

本项目实现了完整的基于角色的访问控制系统，包括：

1. **路由级权限控制** - 通过路由守卫保护页面访问
2. **UI级权限控制** - 根据用户角色显示/隐藏界面元素
3. **403 Forbidden 页面** - 优雅处理无权限访问
4. **权限 Composable** - 提供全局权限管理功能

## 测试场景

### 1. 未登录用户访问
- 访问 `/dashboard` → 重定向到 `/login`
- 访问 `/admin` → 重定向到 `/login`
- 访问 `/community` → 重定向到 `/login`

### 2. 学生用户访问
**登录凭据：**
- Email: `student@example.com`
- Password: `student123`

**允许访问：**
- ✅ `/dashboard` - 学生仪表板
- ✅ `/community` - 社区页面
- ✅ `/` - 首页

**禁止访问：**
- ❌ `/admin` → 重定向到 `/403` (Forbidden 页面)

### 3. 咨询师用户访问
**登录凭据：**
- Email: `counselor@example.com`
- Password: `counselor123`

**允许访问：**
- ✅ `/dashboard` - 咨询师仪表板
- ✅ `/community` - 社区页面
- ✅ `/admin` - 管理面板
- ✅ `/` - 首页

### 4. 已登录用户访问登录/注册页
- 学生访问 `/login` → 重定向到 `/dashboard`
- 咨询师访问 `/login` → 重定向到 `/admin`
- 学生访问 `/register` → 重定向到 `/dashboard`
- 咨询师访问 `/register` → 重定向到 `/admin`

## 权限控制实现

### 路由守卫 (src/router/index.js)
```javascript
// 需要认证的路由
meta: { requiresAuth: true }

// 需要咨询师角色的路由
meta: { requiresCounselor: true }

// 访客路由（已登录用户不能访问）
meta: { guest: true }
```

### UI 权限控制 (src/App.vue)
```vue
<!-- 仅认证用户可见 -->
<li class="nav-item" v-if="isAuthenticated">
  <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
</li>

<!-- 仅咨询师可见 -->
<li class="nav-item" v-if="isAuthenticated && isCounselor">
  <router-link class="nav-link" to="/admin">Counselor Panel</router-link>
</li>
```

### 权限 Composable (src/composables/useAuth.js)
```javascript
import { useAuth } from './composables/useAuth'

const { 
  isAuthenticated, 
  isCounselor, 
  canAccess, 
  requireCounselor 
} = useAuth()

// 检查权限
if (canAccess('counselor')) {
  // 执行咨询师专用操作
}

// 要求特定角色
requireCounselor(() => {
  // 只有咨询师能执行的代码
})
```

## 安全特性

1. **密码哈希** - 使用 SHA-256 哈希存储密码
2. **XSS 防护** - 输入数据净化
3. **路由保护** - 多层路由守卫
4. **状态持久化** - localStorage 安全存储
5. **权限验证** - 前后端权限检查

## 测试步骤

1. 启动开发服务器：`npm run dev`
2. 访问 `http://localhost:5173`
3. 尝试不同角色的登录凭据
4. 测试各种访问场景
5. 验证 403 页面的显示

## 预期结果

- 所有权限控制按预期工作
- 403 页面优雅显示
- 路由重定向正确
- UI 元素根据角色显示/隐藏
- 无控制台错误
