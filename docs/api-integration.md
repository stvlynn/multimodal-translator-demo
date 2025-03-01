# Dify API 集成指南

本文档提供了在多模态翻译应用中集成 Dify API 的详细指南，包括代码示例和最佳实践。

## 目录

- [准备工作](#准备工作)
- [API 客户端配置](#api-客户端配置)
- [文本翻译实现](#文本翻译实现)
- [文件上传实现](#文件上传实现)
- [文件翻译实现](#文件翻译实现)
- [错误处理](#错误处理)
- [性能优化](#性能优化)

## 准备工作

在开始集成之前，您需要：

1. 注册 Dify 账户并创建应用
2. 获取 API 密钥
3. 了解 Dify API 的基本结构和限制

## API 客户端配置

以下是使用 Axios 创建 API 客户端的示例代码：

```javascript
// src/services/api.js
import axios from 'axios';

// 创建 API 客户端
const createApiClient = (baseUrl, apiKey) => {
  const client = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  });

  // 请求拦截器
  client.interceptors.request.use(
    (config) => {
      console.log(`API 请求: ${config.method.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('API 请求错误:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response) => {
      console.log(`API 响应: ${response.status} ${response.statusText}`);
      return response;
    },
    (error) => {
      console.error('API 响应错误:', error.response || error);
      return Promise.reject(error);
    }
  );

  return client;
};

export default createApiClient;
```

## 文本翻译实现

以下是实现文本翻译功能的代码示例：

```javascript
// src/services/translationService.js
import createApiClient from './api';

export const translateText = async (
  baseUrl,
  apiKey,
  text,
  inputLang,
  outputLang,
  mode = 'fast'
) => {
  try {
    console.log(`翻译文本: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
    console.log(`从 ${inputLang} 翻译到 ${outputLang}, 模式: ${mode}`);

    const client = createApiClient(baseUrl, apiKey);
    
    const requestBody = {
      inputs: {
        type: 'text',
        textInput: text,
        inputLang,
        outputLang,
        mode
      },
      response_mode: 'blocking',
      user: 'user-' + Date.now()
    };
    
    console.log('翻译请求体:', JSON.stringify(requestBody, null, 2));
    
    const response = await client.post('/workflows/run', requestBody);
    
    console.log('翻译响应:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      return response.data.data.outputs.textOutput;
    } else {
      throw new Error(response.data.error?.message || '翻译失败');
    }
  } catch (error) {
    console.error('文本翻译错误:', error);
    throw error;
  }
};
```

## 文件上传实现

以下是实现文件上传功能的代码示例：

```javascript
// src/services/fileService.js
import axios from 'axios';

export const uploadFile = async (baseUrl, apiKey, fileUri, fileName, fileType) => {
  try {
    console.log(`上传文件: ${fileName}, 类型: ${fileType}`);
    
    // 创建表单数据
    const formData = new FormData();
    
    // 添加文件
    const fileToUpload = {
      uri: fileUri,
      name: fileName,
      type: fileType
    };
    
    formData.append('file', fileToUpload);
    formData.append('user', 'user-' + Date.now());
    formData.append('save_as', fileName);
    
    console.log('上传文件信息:', {
      uri: fileUri,
      name: fileName,
      type: fileType
    });
    
    // 发送请求
    const response = await axios.post(`${baseUrl}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    console.log('文件上传响应:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('文件上传错误:', error.response?.data || error.message);
    throw error;
  }
};
```

## 文件翻译实现

以下是实现文件翻译功能的代码示例：

```javascript
// src/services/translationService.js
import createApiClient from './api';

export const translateFile = async (
  baseUrl,
  apiKey,
  fileId,
  fileType,
  inputLang,
  outputLang,
  mode = 'focus'
) => {
  try {
    console.log(`翻译文件: ${fileId}, 类型: ${fileType}`);
    console.log(`从 ${inputLang} 翻译到 ${outputLang}, 模式: ${mode}`);
    
    const client = createApiClient(baseUrl, apiKey);
    
    // 确定正确的请求类型
    const requestType = fileType === 'image' ? 'image' : 'file';
    
    const requestBody = {
      inputs: {
        type: requestType,
        file: {
          transfer_method: 'local_file',
          upload_file_id: fileId,
          type: fileType
        },
        inputLang,
        outputLang,
        mode
      },
      response_mode: 'blocking',
      user: 'user-' + Date.now()
    };
    
    console.log('文件翻译请求体:', JSON.stringify(requestBody, null, 2));
    
    const response = await client.post('/workflows/run', requestBody);
    
    console.log('文件翻译响应:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      return response.data.data.outputs.textOutput;
    } else {
      throw new Error(response.data.error?.message || '文件翻译失败');
    }
  } catch (error) {
    console.error('文件翻译错误:', error.response?.data || error.message);
    throw error;
  }
};
```

## 错误处理

以下是处理 API 错误的最佳实践：

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  // 网络错误
  if (!error.response) {
    return {
      message: '网络连接错误，请检查您的互联网连接',
      code: 'network_error'
    };
  }

  // 服务器响应错误
  const { status, data } = error.response;

  switch (status) {
    case 400:
      return {
        message: data.error?.message || '请求格式错误',
        code: data.error?.code || 'bad_request'
      };
    case 401:
      return {
        message: '认证失败，请检查您的 API 密钥',
        code: 'unauthorized'
      };
    case 403:
      return {
        message: '您没有权限执行此操作',
        code: 'forbidden'
      };
    case 404:
      return {
        message: '请求的资源不存在',
        code: 'not_found'
      };
    case 413:
      return {
        message: '文件大小超过限制',
        code: 'file_too_large'
      };
    case 429:
      return {
        message: '请求过于频繁，请稍后再试',
        code: 'rate_limited'
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: '服务器错误，请稍后再试',
        code: 'server_error'
      };
    default:
      return {
        message: `未知错误 (${status}): ${data.error?.message || '请稍后再试'}`,
        code: data.error?.code || 'unknown_error'
      };
  }
};

// 使用示例
try {
  const result = await translateText(...);
  // 处理成功结果
} catch (error) {
  const { message, code } = handleApiError(error);
  console.error(`错误 [${code}]: ${message}`);
  // 显示错误消息给用户
}
```

## 性能优化

以下是一些优化 API 调用性能的建议：

### 1. 实现请求缓存

```javascript
// src/utils/cache.js
const cache = new Map();

export const getCachedResult = (key) => {
  const cachedItem = cache.get(key);
  if (cachedItem && Date.now() - cachedItem.timestamp < 3600000) { // 1小时缓存
    return cachedItem.data;
  }
  return null;
};

export const setCachedResult = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// 使用示例
const cacheKey = `translate_${text}_${inputLang}_${outputLang}`;
const cachedResult = getCachedResult(cacheKey);

if (cachedResult) {
  return cachedResult;
}

const result = await translateText(...);
setCachedResult(cacheKey, result);
return result;
```

### 2. 实现请求节流

```javascript
// src/utils/throttle.js
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 使用示例
const throttledTranslate = throttle(async () => {
  const result = await translateText(...);
  setTranslation(result);
}, 1000); // 限制为每秒最多一次请求
```

### 3. 实现批量处理

对于大量小文本的翻译，可以考虑批量处理：

```javascript
// src/utils/batch.js
export const batchProcess = async (items, processFn, batchSize = 5) => {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(processFn);
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
};

// 使用示例
const textItems = ['文本1', '文本2', '文本3', ...];
const translateItem = (text) => translateText(baseUrl, apiKey, text, inputLang, outputLang);

const translatedItems = await batchProcess(textItems, translateItem, 3);
```

## 总结

通过本指南中的代码示例和最佳实践，您应该能够成功集成 Dify API 到您的多模态翻译应用中。记住要正确处理错误，优化性能，并遵循 Dify API 的使用限制。

有关更多详细信息，请参考 [Dify API 文档](https://docs.dify.ai/v/zh-hans/api-reference/introduction) 和 [API 请求示例](./api-examples.md)。 