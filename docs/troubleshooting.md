# 多模态翻译应用故障排除指南

本文档提供了在使用多模态翻译应用时可能遇到的常见问题及其解决方案。

## 目录

- [API 连接问题](#api-连接问题)
- [文件上传错误](#文件上传错误)
- [文件翻译问题](#文件翻译问题)
- [文本翻译问题](#文本翻译问题)
- [应用崩溃问题](#应用崩溃问题)
- [性能问题](#性能问题)

## API 连接问题

### 问题：无法连接到 Dify API

**症状**：应用无法连接到 Dify API，显示网络错误或连接超时。

**可能原因**：
1. API 密钥无效或过期
2. 网络连接问题
3. Dify 服务器宕机
4. API 基础 URL 配置错误

**解决方案**：
1. 检查 API 密钥是否正确
   ```javascript
   // 在设置页面中验证 API 密钥
   console.log('当前 API 密钥:', apiKey);
   ```

2. 验证网络连接
   ```javascript
   // 测试网络连接
   fetch('https://api.dify.ai/v1/ping')
     .then(response => console.log('Dify API 可访问:', response.status))
     .catch(error => console.error('Dify API 不可访问:', error));
   ```

3. 确认 API 基础 URL 配置
   ```javascript
   // 检查 API 基础 URL
   console.log('当前 API 基础 URL:', baseUrl);
   // 应该是 https://api.dify.ai/v1
   ```

4. 尝试使用 curl 命令测试 API
   ```bash
   curl -X GET "https://api.dify.ai/v1/ping" \
     -H "Authorization: Bearer your_api_key_here"
   ```

### 问题：API 请求返回 401 未授权错误

**症状**：API 请求返回 401 错误，表示未授权。

**可能原因**：
1. API 密钥无效或过期
2. API 密钥权限不足
3. API 密钥格式错误

**解决方案**：
1. 在 Dify 控制台中重新生成 API 密钥
2. 确保 API 密钥格式正确，包括 `Bearer` 前缀
   ```javascript
   // 正确的 API 密钥格式
   headers: {
     'Authorization': `Bearer ${apiKey}`
   }
   ```

## 文件上传错误

### 问题：文件上传失败，返回 400 错误

**症状**：尝试上传文件时，API 返回 400 错误。

**可能原因**：
1. 文件格式不正确
2. 请求格式错误
3. 文件大小超过限制
4. 文件对象格式不正确

**解决方案**：
1. 检查文件格式和 MIME 类型
   ```javascript
   // 检查文件信息
   console.log('文件信息:', {
     name: file.name,
     type: file.type,
     size: file.size,
     uri: file.uri
   });
   ```

2. 确保文件大小在限制范围内（通常小于 10MB）
   ```javascript
   // 检查文件大小
   if (file.size > 10 * 1024 * 1024) {
     console.error('文件大小超过 10MB 限制');
     return;
   }
   ```

3. 正确构建 FormData 对象
   ```javascript
   const formData = new FormData();
   
   // 正确添加文件
   const fileToUpload = {
     uri: fileUri,
     name: fileName,
     type: fileType
   };
   
   formData.append('file', fileToUpload);
   formData.append('user', 'user-123');
   ```

4. 确保请求头正确
   ```javascript
   headers: {
     'Content-Type': 'multipart/form-data',
     'Authorization': `Bearer ${apiKey}`
   }
   ```

### 问题：iOS 上文件上传失败，但 Android 正常

**症状**：在 iOS 设备上上传文件失败，但在 Android 设备上正常。

**可能原因**：
1. iOS 和 Android 处理文件 URI 的方式不同
2. iOS 文件类型识别问题
3. iOS 文件权限问题

**解决方案**：
1. 针对 iOS 平台特别处理文件 URI
   ```javascript
   // 处理不同平台的文件 URI
   import { Platform } from 'react-native';
   
   const getFileUri = (uri) => {
     if (Platform.OS === 'ios' && uri.startsWith('file://')) {
       return uri;
     } else if (Platform.OS === 'android') {
       return uri;
     }
     return uri;
   };
   ```

2. 确保正确设置 iOS 文件类型
   ```javascript
   // 根据文件扩展名确定 MIME 类型
   const getMimeType = (fileName) => {
     const ext = fileName.split('.').pop().toLowerCase();
     switch (ext) {
       case 'jpg':
       case 'jpeg':
         return 'image/jpeg';
       case 'png':
         return 'image/png';
       case 'pdf':
         return 'application/pdf';
       // 添加更多类型
       default:
         return 'application/octet-stream';
     }
   };
   ```

## 文件翻译问题

### 问题：文件上传成功但翻译失败

**症状**：文件成功上传到 Dify，但翻译请求返回错误。

**可能原因**：
1. 文件类型参数不正确
2. 文件内容不支持翻译
3. 请求参数格式错误
4. 文件 ID 使用不正确

**解决方案**：
1. 确保正确设置文件类型
   ```javascript
   // 根据文件扩展名确定 Dify 文件类型
   const getDifyFileType = (fileName) => {
     const ext = fileName.split('.').pop().toLowerCase();
     
     // 图片类型
     if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) {
       return 'image';
     }
     
     // 文档类型
     if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'md'].includes(ext)) {
       return 'document';
     }
     
     // 音频类型
     if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) {
       return 'audio';
     }
     
     // 视频类型
     if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) {
       return 'video';
     }
     
     // 默认为文档类型
     return 'document';
   };
   ```

2. 检查翻译请求格式
   ```javascript
   // 正确的翻译请求格式
   const requestBody = {
     inputs: {
       type: fileType === 'image' ? 'image' : 'file',
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
     user: 'user-123'
   };
   
   console.log('翻译请求体:', JSON.stringify(requestBody, null, 2));
   ```

3. 确保使用正确的文件 ID
   ```javascript
   // 从上传响应中获取文件 ID
   const fileId = uploadResponse.id;
   console.log('使用的文件 ID:', fileId);
   ```

## 文本翻译问题

### 问题：文本翻译返回空结果

**症状**：发送文本翻译请求后，返回的翻译结果为空。

**可能原因**：
1. 输入文本为空
2. 语言参数不正确
3. API 响应格式变化

**解决方案**：
1. 检查输入文本是否为空
   ```javascript
   if (!text || text.trim() === '') {
     console.error('输入文本为空');
     return;
   }
   ```

2. 验证语言参数
   ```javascript
   // 支持的语言列表
   const supportedLanguages = ['中文', '英语', '日语', '韩语', '法语', '德语', '西班牙语', '俄语'];
   
   if (!supportedLanguages.includes(inputLang) || !supportedLanguages.includes(outputLang)) {
     console.error('不支持的语言:', { inputLang, outputLang });
     return;
   }
   ```

3. 检查 API 响应格式
   ```javascript
   console.log('API 响应:', JSON.stringify(response.data, null, 2));
   
   // 安全地获取翻译结果
   const translatedText = response.data?.data?.outputs?.textOutput || '';
   ```

## 应用崩溃问题

### 问题：应用在特定操作后崩溃

**症状**：应用在执行特定操作（如上传大文件或翻译长文本）后崩溃。

**可能原因**：
1. 内存溢出
2. 未处理的异常
3. 异步操作问题
4. 组件状态更新问题

**解决方案**：
1. 添加全局错误处理
   ```javascript
   // 在 App.js 中添加
   import { LogBox, ErrorUtils } from 'react-native';
   
   // 忽略特定警告
   LogBox.ignoreLogs(['Warning: ...']);
   
   // 全局错误处理
   ErrorUtils.setGlobalHandler((error, isFatal) => {
     console.error('全局错误:', error);
     // 可以在这里显示错误提示或重置应用状态
   });
   ```

2. 使用 try-catch 包装异步操作
   ```javascript
   const handleTranslation = async () => {
     try {
       setIsLoading(true);
       const result = await translateText(...);
       setTranslatedText(result);
     } catch (error) {
       console.error('翻译错误:', error);
       setError('翻译失败: ' + error.message);
     } finally {
       setIsLoading(false);
     }
   };
   ```

3. 限制输入大小
   ```javascript
   // 限制文本长度
   if (text.length > 5000) {
     setError('文本长度超过限制 (5000 字符)');
     return;
   }
   
   // 限制文件大小
   if (file.size > 10 * 1024 * 1024) {
     setError('文件大小超过限制 (10MB)');
     return;
   }
   ```

## 性能问题

### 问题：应用响应缓慢

**症状**：应用在处理翻译请求时响应缓慢，UI 卡顿。

**可能原因**：
1. 大量未优化的 API 请求
2. 主线程阻塞
3. 内存泄漏
4. 组件重复渲染

**解决方案**：
1. 实现请求节流和防抖
   ```javascript
   import { debounce } from 'lodash';
   
   // 防抖处理翻译请求
   const debouncedTranslate = debounce(async (text) => {
     try {
       const result = await translateText(...);
       setTranslatedText(result);
     } catch (error) {
       console.error('翻译错误:', error);
     }
   }, 500);
   ```

2. 使用 `useMemo` 和 `useCallback` 优化组件
   ```javascript
   // 优化计算密集型操作
   const processedText = useMemo(() => {
     return someExpensiveOperation(text);
   }, [text]);
   
   // 优化回调函数
   const handleSubmit = useCallback(() => {
     debouncedTranslate(text);
   }, [text, debouncedTranslate]);
   ```

3. 实现分页加载和虚拟列表
   ```javascript
   import { FlatList } from 'react-native';
   
   // 使用 FlatList 代替 ScrollView
   <FlatList
     data={translationHistory}
     keyExtractor={(item) => item.id}
     renderItem={({ item }) => <TranslationItem item={item} />}
     initialNumToRender={10}
     maxToRenderPerBatch={5}
     windowSize={5}
   />
   ```

4. 使用 React.memo 优化组件渲染
   ```javascript
   const TranslationItem = React.memo(({ item }) => {
     return (
       <View>
         <Text>{item.inputText}</Text>
         <Text>{item.outputText}</Text>
       </View>
     );
   });
   ```

## 其他常见问题

### 问题：应用在后台运行一段时间后无法恢复

**症状**：应用在后台运行一段时间后，恢复到前台时出现错误或白屏。

**解决方案**：
1. 在应用恢复时重新初始化关键组件
   ```javascript
   import { AppState } from 'react-native';
   
   useEffect(() => {
     const handleAppStateChange = (nextAppState) => {
       if (nextAppState === 'active') {
         // 应用恢复到前台
         checkApiConnection();
         loadSavedSettings();
       }
     };
     
     const subscription = AppState.addEventListener('change', handleAppStateChange);
     
     return () => {
       subscription.remove();
     };
   }, []);
   ```

### 问题：无法保存翻译历史

**症状**：应用无法保存翻译历史或设置。

**解决方案**：
1. 使用 AsyncStorage 正确保存数据
   ```javascript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   // 保存翻译历史
   const saveTranslationHistory = async (history) => {
     try {
       await AsyncStorage.setItem('translationHistory', JSON.stringify(history));
     } catch (error) {
       console.error('保存翻译历史失败:', error);
     }
   };
   
   // 加载翻译历史
   const loadTranslationHistory = async () => {
     try {
       const savedHistory = await AsyncStorage.getItem('translationHistory');
       if (savedHistory) {
         setTranslationHistory(JSON.parse(savedHistory));
       }
     } catch (error) {
       console.error('加载翻译历史失败:', error);
     }
   };
   ```

## 调试技巧

### 启用详细日志记录

```javascript
// 在 API 服务中添加详细日志
const enableVerboseLogging = true;

if (enableVerboseLogging) {
  console.log('请求 URL:', url);
  console.log('请求头:', headers);
  console.log('请求体:', JSON.stringify(body, null, 2));
}

// 响应日志
if (enableVerboseLogging) {
  console.log('响应状态:', response.status);
  console.log('响应数据:', JSON.stringify(response.data, null, 2));
}
```

### 使用 React Native Debugger

1. 安装 React Native Debugger
2. 在应用中启用远程调试
3. 使用 Chrome 开发者工具检查网络请求和控制台日志

### 使用条件断点

在关键代码位置添加条件断点，只在特定条件下中断执行：

```javascript
// 示例：只在文件大小超过 5MB 时记录日志
if (file.size > 5 * 1024 * 1024) {
  console.warn('大文件上传:', file.name, file.size);
}
```

## 联系支持

如果您尝试了上述所有解决方案但问题仍然存在，请联系我们的支持团队：

- 电子邮件：support@example.com
- 在应用中使用"报告问题"功能
- 访问我们的支持网站：https://example.com/support

提交问题报告时，请包含以下信息：
1. 应用版本
2. 设备型号和操作系统版本
3. 问题的详细描述
4. 重现问题的步骤
5. 相关的错误消息或截图 