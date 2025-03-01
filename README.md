# 多模态翻译应用

一个基于 Expo 和 Dify API 的多模态翻译应用，支持文本、图片和文档翻译。

## 功能特点

- 文本翻译：支持多种语言之间的文本翻译
- 图片翻译：上传图片并提取其中的文本进行翻译
- 文档翻译：支持 PDF、Word、TXT 等文档格式的翻译
- 历史记录：保存翻译历史，方便查看和重用
- 设置管理：自定义 API 密钥、基础 URL 和翻译模式

## 安装与运行

### 前提条件

- Node.js 18.x 或更高版本
- Expo CLI
- Dify API 密钥

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/multimodal-translator-demo.git
cd multimodal-translator-demo
```

2. 安装依赖

```bash
npm install --legacy-peer-deps
```

3. 启动应用

```bash
npx expo start
```

4. 在 Expo Go 应用中扫描二维码或使用模拟器运行

### 配置 Dify API

在应用的设置页面中，您需要配置：

- API 密钥：从 Dify 控制台获取
- 基础 URL：默认为 `https://api.dify.ai/v1`
- 翻译模式：选择 `fast` 或 `focus`

## 项目结构

```
multimodal-translator-demo/
├── App.js                 # 应用入口
├── babel.config.js        # Babel 配置
├── index.js               # 注册应用组件
├── package.json           # 项目依赖
├── docs/                  # 文档
│   ├── api-examples.md    # API 请求示例
│   ├── api-integration.md # API 集成指南
│   └── troubleshooting.md # 故障排除指南
└── src/
    ├── components/        # UI 组件
    ├── context/           # 上下文管理
    ├── navigation/        # 导航配置
    ├── screens/           # 应用屏幕
    ├── services/          # API 服务
    └── utils/             # 工具函数
```

## 文档

- [API 请求示例](docs/api-examples.md)：Dify API 的 curl 请求和响应示例
- [API 集成指南](docs/api-integration.md)：如何在应用中集成 Dify API
- [故障排除指南](docs/troubleshooting.md)：常见问题和解决方案

## 支持的语言

- 中文
- 英语
- 日语
- 韩语
- 法语
- 德语
- 西班牙语
- 俄语
- 更多语言...

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，请通过以下方式联系我们：

- 电子邮件：contact@example.com
- GitHub Issues：[创建问题](https://github.com/yourusername/multimodal-translator-demo/issues)

## 致谢

- [Expo](https://expo.dev/) - 应用开发框架
- [React Native](https://reactnative.dev/) - 跨平台移动应用开发
- [Dify](https://dify.ai/) - AI API 服务提供商 