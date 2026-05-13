# 敏感词检测前端 - 增强版

基于 Vue 3 + Element Plus 的敏感词检测和词库管理前端应用

## 功能特性

### 核心功能
- 实时敏感词检测
- 一键替换敏感词
- 词库浏览和搜索
- 匿名贡献敏感词
- 多分类管理

### 增强功能
- 用户认证系统（登录/注册）
- 响应式设计（支持移动端）
- 暗色模式切换
- 词库统计分析
- 分页浏览
- 复制到剪贴板
- 加载示例文本

## 技术栈

- Vue 3 (Composition API)
- Vue Router 4
- Pinia (状态管理)
- Element Plus (UI组件库)
- Axios (HTTP客户端)
- Day.js (日期处理)
- Vite (构建工具)

## 项目结构

```
frontend/
├── src/
│   ├── api/                    # API接口
│   │   ├── auth.js           # 认证相关API
│   │   └── wordLib.js       # 词库相关API
│   ├── assets/               # 静态资源
│   ├── components/           # 公共组件
│   │   ├── AppHeader.vue    # 头部导航
│   │   ├── AppFooter.vue    # 底部信息
│   │   └── DetectSection.vue # 检测功能组件
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── stores/              # Pinia状态管理
│   │   ├── auth.js         # 认证状态
│   │   ├── wordLib.js      # 词库状态
│   │   └── theme.js       # 主题状态
│   ├── styles/              # 全局样式
│   │   ├── index.css       # 基础样式
│   │   └── element-plus.css # Element Plus覆盖
│   ├── views/               # 页面组件
│   │   ├── Home.vue        # 首页
│   │   ├── Detect.vue      # 检测页
│   │   ├── WordLib.vue     # 词库管理页
│   │   ├── Stats.vue       # 统计页
│   │   ├── About.vue       # 关于页
│   │   ├── Login.vue       # 登录页
│   │   └── Register.vue   # 注册页
│   ├── App.vue             # 根组件
│   └── main.js            # 入口文件
├── index.html              # HTML模板
├── package.json            # 依赖配置
├── vite.config.js         # Vite配置
└── README.md              # 项目文档
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 生产构建

```bash
npm run build
```

构建产物位于 `dist/` 目录

### 预览构建

```bash
npm run preview
```

## 配置说明

### API配置

修改 `src/api/auth.js` 中的基础URL：

```javascript
const request = axios.create({
  baseURL: '/api',  // 开发环境使用代理
  timeout: 30000
})
```

生产环境建议配置完整API地址：

```javascript
const request = axios.create({
  baseURL: 'https://your-api-domain.com/api',
  timeout: 30000
})
```

### 代理配置

开发环境代理配置在 `vite.config.js`：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

## 路由说明

| 路径 | 组件 | 说明 | 是否认证 |
|------|------|------|----------|
| `/` | Home | 首页（检测功能） | 否 |
| `/detect` | Detect | 检测页面 | 否 |
| `/word-lib` | WordLib | 词库管理 | 是 |
| `/stats` | Stats | 统计信息 | 是 |
| `/about` | About | 关于我们 | 否 |
| `/login` | Login | 登录页面 | 否 |
| `/register` | Register | 注册页面 | 否 |

## 状态管理

### auth.js

用户认证状态管理

- `token` - JWT令牌
- `user` - 用户信息
- `isAuthenticated` - 是否已认证
- `isAdmin` - 是否管理员

### wordLib.js

词库状态管理

- `wordLib` - 词库数据
- `categories` - 分类列表
- `stats` - 统计信息
- `words` - 分页词库
- `totalCount` - 总词数

### theme.js

主题状态管理

- `isDark` - 暗色模式

## 组件说明

### AppHeader

头部导航组件，包含：

- Logo和标题
- 导航菜单（检测/词库/统计/关于）
- 主题切换按钮
- 用户菜单（登录后显示）
- 移动端导航抽屉

### AppFooter

底部信息组件，包含：

- 关于信息
- 快速链接
- 词库统计
- 版权信息

### DetectSection

检测功能组件，包含：

- 文本输入区域
- 检测结果展示
- 敏感词列表
- 替换功能
- 添加敏感词表单

## 样式规范

### 颜色变量

```css
--color-primary: #ff2442;      /* 主色调 */
--color-success: #52c41a;      /* 成功 */
--color-warning: #faad14;      /* 警告 */
--color-danger: #ff4d4f;       /* 危险 */
--color-info: #1890ff;         /* 信息 */
```

### 间距变量

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### 圆角变量

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
```

## 部署说明

### 环境变量

创建 `.env.production` 文件：

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 部署步骤

1. 构建项目

```bash
npm run build
```

2. 将 `dist/` 目录上传到服务器

3. 配置Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-server:3000;
    }
}
```

### Docker部署

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 性能优化

- 路由懒加载
- 组件按需导入
- 图片懒加载
- 代码分割
- Gzip压缩

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## License

MIT License
