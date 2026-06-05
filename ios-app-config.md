# iOS App Store 上架配置清单

## 必需的Info.plist配置
在Xcode中打开 ios/App/App/Info.plist，添加：

```
<key>CFBundleDisplayName</key>
<string>法治同行</string>
<key>CFBundleName</key>
<string>法治同行</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>LSRequiresIPhoneOS</key>
<true/>
<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>
<key>UIRequiredDeviceCapabilities</key>
<array><string>armv7</string></array>
<key>UISupportedInterfaceOrientations</key>
<array><string>UIInterfaceOrientationPortrait</string></array>
```

## 必需的App Store截图(6.7寸iPhone)
- 首页截图
- 场景详情截图  
- AI问答截图
- 价值观地图截图
- 法典全文截图

## 上架信息
- 隐私政策URL: https://legal-mqhrhjb7s-unihuans-projects.vercel.app/privacy.html
- 技术支持: GitHub Issues
- 分类: 工具 > 法律
- 年龄分级: 4+
