#!/bin/bash
# ═══════════════════════════════════════════════
#  法治同行 · 阿里云OSS + CDN 国内部署脚本
#  解决Vercel国内访问慢的问题
# ═══════════════════════════════════════════════

set -e

# === 配置区(请修改为你的实际值) ===
OSS_BUCKET="legal-app"                    # OSS Bucket名称
OSS_REGION="oss-cn-hangzhou"              # OSS地域
OSS_ENDPOINT="${OSS_REGION}.aliyuncs.com" # OSS Endpoint
CDN_DOMAIN="legal.unihuan.cn"             # CDN加速域名(需已备案)

echo "🚀 法治同行 · 国内CDN部署"
echo "================================"
echo ""

# 1. 检查依赖
command -v ossutil >/dev/null 2>&1 || { echo "❌ 请先安装 ossutil: brew install ossutil"; exit 1; }
echo "✅ ossutil 已安装"

# 2. 上传静态文件到OSS
echo ""
echo "📤 上传文件到OSS..."
ossutil cp -r -u . oss://${OSS_BUCKET}/ \
  --include "*.html" \
  --include "*.css" \
  --include "*.js" \
  --include "*.json" \
  --include "*.png" \
  --include "*.svg" \
  --exclude "node_modules/*" \
  --exclude ".git/*" \
  --exclude "deploy-cn.sh" \
  --exclude "miniprogram/*"

echo "✅ 文件上传完成"

# 3. 设置默认首页
echo ""
echo "⚙️  配置静态网站..."
ossutil website oss://${OSS_BUCKET}/ --index index.html --error 404.html 2>/dev/null || echo "   (网站配置已存在或需手动设置)"

# 4. CDN刷新(如果有CDN)
echo ""
echo "🔄 刷新CDN缓存..."
if [ -n "$CDN_DOMAIN" ]; then
  echo "   请手动在阿里云CDN控制台刷新缓存"
  echo "   或使用阿里云CLI: aliyun cdn RefreshObjectCaches --ObjectPath https://${CDN_DOMAIN}/ --ObjectType Directory"
fi

echo ""
echo "════════════════════════════════════════"
echo "  ✅ 部署完成!"
echo ""
echo "  🌐 国内访问地址:"
echo "     OSS直接: https://${OSS_BUCKET}.${OSS_ENDPOINT}/"
if [ -n "$CDN_DOMAIN" ]; then
echo "     CDN加速: https://${CDN_DOMAIN}/"
fi
echo ""
echo "  📋 后续步骤:"
echo "     1. 在阿里云CDN控制台绑定域名: ${CDN_DOMAIN}"
echo "     2. 配置HTTPS证书"
echo "     3. 设置缓存规则(静态文件缓存7天)"
echo "     4. 将Vercel域名301重定向到国内域名"
echo "════════════════════════════════════════"
