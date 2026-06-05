# 法治同行 · 国内CDN部署指南

## 为什么需要国内CDN

Vercel服务器在国外 → 国内访问延迟500ms+ → 首次加载需要3-8秒
国内CDN → 延迟<50ms → 首次加载<1秒

## 方案对比

| 平台 | 成本 | 速度 | 备案需求 | 推荐 |
|------|------|------|---------|------|
| 阿里云OSS+CDN | ~¥5/月 | 极快 | 需备案域名 | ⭐⭐⭐ |
| 腾讯云COS+CDN | ~¥5/月 | 极快 | 需备案域名 | ⭐⭐⭐ |
| Cloudflare Pages | 免费 | 中等 | 不需要 | ⭐⭐ |
| 七牛云 | ~¥10/月 | 快 | 需备案域名 | ⭐⭐ |

## 方案一: 阿里云OSS (推荐)

### 1. 创建OSS Bucket
1. 登录 [oss.console.aliyun.com](https://oss.console.aliyun.com)
2. 创建Bucket: 名称`legal-app`, 地域`杭州`, 读写权限`公共读`
3. 开启静态网站托管: 默认首页`index.html`

### 2. 安装并配置ossutil
```bash
brew install ossutil                          # macOS
ossutil config                                # 按提示输入AccessKey
```

### 3. 执行部署
```bash
cd legal-app
bash deploy-cn.sh
```

### 4. CDN加速
1. 在CDN控制台添加域名 `legal.unihuan.cn`
2. 源站选择OSS Bucket
3. 配置HTTPS证书(免费)
4. 缓存规则: `*.html` 1小时 / `*.css *.js` 7天

### 5. 流量调度
Vercel保留作为海外入口 → 国内用户自动跳转CDN:
```html
<script>
if(window.location.hostname.includes('vercel.app')){
  // 简单判断: 大陆用户跳转
  var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if(tz==='Asia/Shanghai') location.href='https://legal.unihuan.cn';
}
</script>
```

## 方案二: 腾讯云COS (备选)

```bash
pip install coscmd
coscmd config -a <SecretId> -s <SecretKey> -b legal-app -r ap-guangzhou
bash deploy-tencent.sh
```

## 方案三: Cloudflare Pages (免备案)

1. 注册 [Cloudflare](https://cloudflare.com)
2. Pages → 连接GitHub仓库
3. 自动构建部署
4. 国内部分城市可访问(非100%)

## 部署后验证

```bash
# 检查响应头
curl -I https://legal.unihuan.cn

# 应看到:
# x-cache: HIT (CDN命中)
# cache-control: public, max-age=86400
```

## 成本估算

| 项目 | 月成本 |
|------|--------|
| OSS存储(20MB) | ~¥0.02 |
| CDN流量(100GB) | ~¥15 |
| HTTPS证书 | 免费 |
| **合计** | **~¥15/月** |
