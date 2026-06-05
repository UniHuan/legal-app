# ⚖️ 法治同行 (LegalMate)

一本你真正能读懂的民法典。**完全免费 · 不用注册 · 打开即用**。

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | Vanilla HTML/CSS/JS (零依赖框架) |
| 后端/数据库 | Supabase (PostgreSQL + pgvector + RLS) |
| AI 问答 | Supabase Edge Function + DeepSeek API |
| 设计系统 | CSS Variables + 响应式 (桌面 + 移动端) |

## 项目结构

```
legal-app/
├── index.html      # 应用入口 (SPA)
├── styles.css      # 完整样式系统 (335行)
├── app.js          # 核心逻辑 (679行)
└── README.md       # 本文件
```

## 快速开始

1. 直接用浏览器打开 `index.html`
2. 或部署到任意静态托管服务 (Vercel/Netlify/Cloudflare Pages)

## 环境变量 (Edge Function)

Edge Function `legal-ai-ask` 需要设置:

```
DEEPSEEK_API_KEY=your_deepseek_api_key
```

在 Supabase Dashboard → Edge Functions → legal-ai-ask → Settings 中设置。

## 数据库

所有内容数据存储在 Supabase PostgreSQL 中，Schema 定义见项目根目录的迁移文件。

## 功能

- [x] 首页 (Hero + 热门场景 + 分类浏览)
- [x] 场景详情 (结论 + 行动步骤 + 法条 + 误区警示)
- [x] 价值观地图 (12个社会主义核心价值观)
- [x] 法典全文 (7编浏览 + 搜索)
- [x] AI 智能问答 (DeepSeek + 本地检索双通道)
- [x] 便民工具 (文书参考 + 诉讼费计算 + 法援地图 + 取证指引)
- [x] 每日一题 (框架就绪)
- [x] 银发模式 (一键大字版)
- [x] 完全无需注册登录
- [x] 桌面端 + 移动端响应式

## License

本项目作为法治公共产品，内容数据依法公开，代码采用 MIT 协议。
