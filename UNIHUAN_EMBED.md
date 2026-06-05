# 法治同行 · UniHuan官网嵌入指南

## 方式一：页脚卡片组件（推荐）

在UniHuan官网页脚区域添加以下HTML代码：

```html
<!-- 法治同行 · 页脚快速入口 -->
<a href="https://legal-mqhrhjb7s-unihuans-projects.vercel.app" target="_blank" 
   style="display:flex;align-items:center;gap:12px;padding:12px 20px;
          background:linear-gradient(135deg,#EFF6FF,#DBEAFE);
          border:1px solid #BFDBFE;border-radius:12px;cursor:pointer;
          text-decoration:none;color:inherit;max-width:400px;margin:12px auto;
          transition:all 0.2s;font-family:system-ui,sans-serif;"
   onmouseover="this.style.boxShadow='0 4px 12px rgba(26,86,219,.15)';this.style.transform='translateY(-1px)'"
   onmouseout="this.style.boxShadow='none';this.style.transform='none'">
  <span style="font-size:32px">⚖️</span>
  <span style="flex:1">
    <span style="display:block;font-size:15px;font-weight:700;color:#1A56DB">法治同行</span>
    <span style="display:block;font-size:12px;color:#64748B;margin-top:2px">民法典科普 · 1260条法条 · AI问答</span>
  </span>
  <span style="background:#DC2626;color:#fff;border-radius:12px;padding:4px 10px;font-size:11px;font-weight:600">免费</span>
</a>
```

## 方式二：页脚链接横条（轻量）

在页脚友情链接区域添加：

```html
<a href="https://legal-mqhrhjb7s-unihuans-projects.vercel.app" target="_blank" 
   style="color:#1A56DB;font-weight:600;text-decoration:none">
  ⚖️ 法治同行
</a>
```

## 国内访问加速方案

当前Vercel国内较慢，建议以下替代部署：

1. **阿里云OSS + CDN** — 静态文件托管+国内加速
2. **腾讯云COS + CDN** — 类似方案
3. **Cloudflare Pages** — 部分国内加速

操作步骤（以阿里云为例）：
```bash
# 1. 上传静态文件到OSS
# 2. 开启CDN加速
# 3. 绑定自定义域名（如 legal.unihuan.cn）
```

详细地址: https://github.com/UniHuan/legal-app
