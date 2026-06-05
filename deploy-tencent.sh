#!/bin/bash
# 腾讯云COS + CDN 部署脚本
set -e
COS_BUCKET="legal-app-1234567890"  # 替换为你的Bucket
COS_REGION="ap-guangzhou"
echo "📤 上传到腾讯云COS..."
coscmd upload -r . / --ignore "node_modules/*,.git/*,miniprogram/*,deploy-*.sh" && echo "✅ 完成"
echo "🌐 https://${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com/"
