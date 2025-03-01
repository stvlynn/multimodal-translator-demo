# 多模态翻译应用

一个使用Expo构建的跨平台多模态翻译应用，支持文本和文件（图片、文档）的翻译功能。

## 功能特点

- 文本翻译：支持多种语言之间的互译
- 文件翻译：支持上传图片和文档进行翻译
- 双向翻译：可以轻松切换源语言和目标语言
- 两种翻译模式：
  - 快速模式：更快的翻译速度，适合日常使用
  - 专注模式：更高的翻译质量，适合正式场合
- 自定义API设置：可配置Dify API的基础URL和API密钥

## 技术栈

- React Native / Expo
- React Navigation
- Expo Document Picker & Image Picker
- Axios

## 开始使用

### 前提条件

- Node.js (推荐 v16.x 或更高版本)
- npm 或 yarn
- Expo CLI

### 安装步骤

1. 克隆仓库
   ```
   git clone https://github.com/yourusername/multimodal-translator-demo.git
   cd multimodal-translator-demo
   ```

2. 安装依赖
   ```
   npm install
   ```
   或
   ```
   yarn install
   ```

3. 启动应用
   ```
   npm start
   ```
   或
   ```
   yarn start
   ```

4. 在iOS或Android设备上运行应用
   - 扫描终端中显示的QR码
   - 或者使用iOS模拟器/Android模拟器

## 使用说明

### 翻译文本

1. 在上方输入框中输入要翻译的文本
2. 选择源语言和目标语言
3. 点击中间的翻译按钮
4. 翻译结果将显示在下方输出框中

### 翻译文件

1. 点击输入框右侧的文件图标或图片图标
2. 选择要翻译的文档或图片
3. 系统将自动上传文件并返回翻译结果

### 配置API

1. 点击右上角的设置图标
2. 输入你的Dify API密钥
3. 如有需要，修改API基础URL
4. 选择所需的翻译模式
5. 点击"保存设置"按钮

## API接口说明

本应用使用Dify AI作为后端翻译服务。您需要获取Dify API密钥才能使用翻译功能。

### API参数

- `baseUrl`：API基础URL，默认为`https://api.dify.ai/v1`
- `apiKey`：您的Dify API密钥
- 翻译模式：`fast`（快速）或`focus`（专注）

## 许可证

MIT 