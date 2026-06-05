# 🚀 法治同行 v1.0.0 发布说明

## 版本信息
- 版本号: v1.0.0
- 发布日期: 2026-06-05
- 代码仓库: https://github.com/UniHuan/legal-app

## 技术栈
- **框架**: Next.js 16 + TypeScript + Tailwind CSS
- **后端**: Supabase (PostgreSQL + pgvector + RLS)
- **AI**: DeepSeek V3 Edge Function
- **部署**: Vercel + 自定义域名 unihuan.cyou
- **移动端**: Capacitor (iOS + Android)

## 功能清单
- [x] 首页 (Hero + 热门场景 + 分类浏览)
- [x] 场景详情 (结论 + 行动步骤 + 法条 + 误区警示)
- [x] 价值观地图 (12个社会主义核心价值观)
- [x] 法典全文 (7编浏览 + 搜索 + 编号直达)
- [x] AI 智能问答 (DeepSeek + 知识库检索)
- [x] 每日一题 (选择题 + 解析)
- [x] 便民工具 (文书参考 + 诉讼费计算)
- [x] 场景分类浏览
- [x] 完全无需注册登录
- [x] 桌面端 + 移动端独立UI
- [x] PWA支持
- [x] iOS App (Capacitor)

## 内容数据
| 类型 | 数量 |
|------|------|
| 法条 | 1,260条 |
| 生活场景 | 128个 |
| 每日一题 | 54题 |
| 案例 | 14个 |
| 价值观 | 12个 |
| 文书模板 | 2个 |
| 法援机构 | 20城 |

## 部署地址
- 线上: https://www.unihuan.cyou
- Vercel: https://legal-app-next-c8j75a6ui-unihuans-projects.vercel.app
- GitHub: https://github.com/UniHuan/legal-app

## 架构
```
legal-app-next/
├── src/app/
│   ├── mobile/    # 移动端 (9 routes)
│   └── desktop/   # 桌面端 (9 routes)
├── src/components/ # 共享组件
├── src/lib/       # API + 类型 + 缓存
├── ios/           # iOS原生工程
└── capacitor.config.json
```
