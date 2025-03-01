import axios from 'axios';

// 创建文本翻译请求
export const translateText = async (
  text,
  inputLang,
  outputLang,
  mode,
  baseUrl,
  apiKey
) => {
  try {
    console.log('翻译文本请求:', {
      url: `${baseUrl}/workflows/run`,
      请求类型: 'text',
      输入语言: inputLang,
      输出语言: outputLang,
      模式: mode,
      文本长度: text.length
    });

    const requestBody = {
      inputs: {
        type: 'text', // 文本翻译使用'text'类型
        textInput: text,
        inputLang,
        outputLang,
        mode,
      },
      response_mode: 'blocking',
      user: 'user-' + Date.now(),
    };

    console.log('请求详情:', JSON.stringify(requestBody));

    const response = await axios.post(
      `${baseUrl}/workflows/run`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 180000, // 设置超时时间为180秒
      }
    );

    console.log('翻译响应:', response.data);
    return response.data.data.outputs.textOutput;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

// 上传文件
export const uploadFile = async (file, baseUrl, apiKey) => {
  try {
    // 打印请求内容，帮助调试
    console.log('上传请求数据:', {
      url: `${baseUrl}/files/upload`,
      fileName: file.name,
      fileType: file.type
    });

    // 创建简单的表单数据
    const formData = new FormData();
    
    // 直接附加文件对象，不要创建新对象
    formData.append('file', file);
    
    // 添加用户标识符
    formData.append('user', 'user123');
    
    // 打印请求体内容
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    // 发送请求
    const response = await axios.post(
      `${baseUrl}/files/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    console.log('上传响应:', response.data);
    return response.data;
  } catch (error) {
    // 提供更详细的错误信息
    const errorMessage = error.response ? 
      `状态: ${error.response.status}, 信息: ${JSON.stringify(error.response.data)}` : 
      error.message;
      
    console.error('文件上传错误:', errorMessage);
    throw new Error(`文件上传失败: ${errorMessage}`);
  }
};

// 处理文件翻译
export const translateFile = async (
  fileId,
  fileType,
  inputLang,
  outputLang,
  mode,
  baseUrl,
  apiKey
) => {
  try {
    // 确保文件类型是Dify API支持的类型
    if (!['document', 'image', 'audio', 'video', 'custom'].includes(fileType)) {
      console.warn(`警告: 不支持的文件类型 "${fileType}", 使用默认类型 "document"`);
      fileType = 'document';
    }

    // 根据文件类型确定API需要的type值
    // API要求顶级type必须是 'file', 'text', 或 'image' 之一
    const apiType = fileType === 'image' ? 'image' : 'file';

    console.log('翻译文件请求:', {
      url: `${baseUrl}/workflows/run`,
      文件ID: fileId,
      文件类型: fileType,
      API类型: apiType,
      输入语言: inputLang,
      输出语言: outputLang,
      模式: mode
    });

    // 构建请求体 - 根据API文档示例结构
    const requestBody = {
      inputs: {
        type: apiType, // 顶级type必填字段: 'file' 或 'image'
        // 文件信息对象
        file: {
          transfer_method: 'local_file',
          upload_file_id: fileId,
          type: fileType, // 文件的实际类型: 'document', 'image', 'audio', 'video', 'custom'
        },
        inputLang,
        outputLang,
        mode,
      },
      response_mode: 'blocking',
      user: 'user-' + Date.now(),
    };
    
    console.log('请求详情:', JSON.stringify(requestBody));

    const response = await axios.post(
      `${baseUrl}/workflows/run`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 180000, // 设置超时时间为180秒
      }
    );

    console.log('翻译响应:', response.data);
    return response.data.data.outputs.textOutput;
  } catch (error) {
    const errorMessage = error.response ? 
      `状态: ${error.response.status}, 信息: ${JSON.stringify(error.response.data)}` : 
      error.message;
      
    console.error('文件翻译错误:', errorMessage);
    throw new Error(`文件翻译失败: ${errorMessage}`);
  }
}; 