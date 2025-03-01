# Dify API 请求示例

本文档提供了使用 Dify API 进行文本和文件翻译的完整 curl 示例，帮助开发者理解如何正确构建请求和解析响应。

## 目录

- [API 密钥设置](#api-密钥设置)
- [文本翻译](#文本翻译)
  - [请求示例](#文本翻译请求示例)
  - [响应示例](#文本翻译响应示例)
- [文件上传](#文件上传)
  - [请求示例](#文件上传请求示例)
  - [响应示例](#文件上传响应示例)
- [文件翻译](#文件翻译)
  - [请求示例](#文件翻译请求示例)
  - [响应示例](#文件翻译响应示例)
- [常见错误](#常见错误)

## API 密钥设置

所有 API 请求都需要在请求头中包含 API 密钥进行身份验证：

```
Authorization: Bearer your_api_key_here
```

请将 `your_api_key_here` 替换为您的实际 Dify API 密钥。

## 文本翻译

### 文本翻译请求示例

```bash
curl -X POST "https://api.dify.ai/v1/workflows/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "inputs": {
      "type": "text",
      "textInput": "这是一段需要翻译的中文文本",
      "inputLang": "中文",
      "outputLang": "英语",
      "mode": "fast"
    },
    "response_mode": "blocking",
    "user": "user-123"
  }'
```

#### 请求参数说明

| 参数 | 说明 |
|------|------|
| `inputs.type` | 输入类型，文本翻译使用 `"text"` |
| `inputs.textInput` | 需要翻译的文本内容 |
| `inputs.inputLang` | 输入语言，如 `"中文"`, `"英语"`, `"日语"` 等 |
| `inputs.outputLang` | 输出语言，如 `"中文"`, `"英语"`, `"日语"` 等 |
| `inputs.mode` | 翻译模式，`"fast"` 或 `"focus"` |
| `response_mode` | 响应模式，使用 `"blocking"` 表示同步等待结果 |
| `user` | 用户标识符，可以是任意字符串 |

### 文本翻译响应示例

```json
{
  "data": {
    "outputs": {
      "textOutput": "This is a Chinese text that needs to be translated"
    },
    "task_id": "task-123456789",
    "workflow_id": "workflow-abcdef"
  },
  "success": true
}
```

#### 响应字段说明

| 字段 | 说明 |
|------|------|
| `data.outputs.textOutput` | 翻译后的文本内容 |
| `data.task_id` | 任务 ID |
| `data.workflow_id` | 工作流 ID |
| `success` | 请求是否成功 |

## 文件上传

在翻译文件之前，需要先将文件上传到 Dify 服务器。

### 文件上传请求示例

```bash
curl -X POST "https://api.dify.ai/v1/files/upload" \
  -H "Authorization: Bearer your_api_key_here" \
  -F "file=@/path/to/your/document.pdf" \
  -F "user=user-123"
```

#### 请求参数说明

| 参数 | 说明 |
|------|------|
| `file` | 要上传的文件，使用 `@` 符号后跟文件路径 |
| `user` | 用户标识符，可以是任意字符串 |

### 文件上传响应示例

```json
{
  "id": "file-123456789",
  "name": "document.pdf",
  "size": 125678,
  "extension": "pdf",
  "mime_type": "application/pdf",
  "created_at": "2023-06-01T12:34:56.789Z",
  "status": "ready"
}
```

#### 响应字段说明

| 字段 | 说明 |
|------|------|
| `id` | 上传文件的唯一标识符，用于后续文件翻译请求 |
| `name` | 文件名称 |
| `size` | 文件大小（字节） |
| `extension` | 文件扩展名 |
| `mime_type` | 文件的 MIME 类型 |
| `created_at` | 文件上传时间 |
| `status` | 文件状态，`"ready"` 表示可以使用 |

## 文件翻译

上传文件后，使用返回的文件 ID 进行翻译。

### 文件翻译请求示例

```bash
curl -X POST "https://api.dify.ai/v1/workflows/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "inputs": {
      "type": "file",
      "file": {
        "transfer_method": "local_file",
        "upload_file_id": "file-123456789",
        "type": "document"
      },
      "inputLang": "英语",
      "outputLang": "中文",
      "mode": "focus"
    },
    "response_mode": "blocking",
    "user": "user-123"
  }'
```

#### 图片翻译请求示例

```bash
curl -X POST "https://api.dify.ai/v1/workflows/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "inputs": {
      "type": "image",
      "file": {
        "transfer_method": "local_file",
        "upload_file_id": "file-123456789",
        "type": "image"
      },
      "inputLang": "英语",
      "outputLang": "中文",
      "mode": "focus"
    },
    "response_mode": "blocking",
    "user": "user-123"
  }'
```

#### 请求参数说明

| 参数 | 说明 |
|------|------|
| `inputs.type` | 输入类型，文件翻译使用 `"file"`，图片翻译使用 `"image"` |
| `inputs.file.transfer_method` | 文件传输方法，使用 `"local_file"` 表示使用已上传的文件 |
| `inputs.file.upload_file_id` | 上传文件后获得的文件 ID |
| `inputs.file.type` | 文件类型，可以是 `"document"`, `"image"`, `"audio"`, `"video"`, `"custom"` |
| `inputs.inputLang` | 输入语言 |
| `inputs.outputLang` | 输出语言 |
| `inputs.mode` | 翻译模式 |
| `response_mode` | 响应模式 |
| `user` | 用户标识符 |

### 文件翻译响应示例

```json
{
  "data": {
    "outputs": {
      "textOutput": "这是从文档中提取并翻译的文本内容。这里可能包含多个段落，取决于原始文档的内容和结构。"
    },
    "task_id": "task-987654321",
    "workflow_id": "workflow-abcdef"
  },
  "success": true
}
```

#### 响应字段说明

| 字段 | 说明 |
|------|------|
| `data.outputs.textOutput` | 翻译后的文本内容 |
| `data.task_id` | 任务 ID |
| `data.workflow_id` | 工作流 ID |
| `success` | 请求是否成功 |

## 常见错误

### 认证错误

```json
{
  "error": {
    "message": "Authentication failed. Please check your API key.",
    "code": "unauthorized"
  },
  "success": false
}
```

### 文件上传错误

```json
{
  "error": {
    "message": "File upload failed. The file size exceeds the maximum limit.",
    "code": "file_too_large"
  },
  "success": false
}
```

### 不支持的文件类型

```json
{
  "error": {
    "message": "Unsupported file type.",
    "code": "unsupported_file_type"
  },
  "success": false
}
```

### 请求格式错误

```json
{
  "error": {
    "message": "Invalid request format. Please check your request body.",
    "code": "invalid_request"
  },
  "success": false
}
```

## 注意事项

1. 确保 API 密钥有效且具有足够的权限
2. 文件大小通常有限制，请检查 Dify 文档了解具体限制
3. 支持的文件类型包括常见的文档格式（PDF、DOCX、TXT 等）和图片格式（JPG、PNG 等）
4. 翻译大文件可能需要较长时间，请设置合理的超时时间 