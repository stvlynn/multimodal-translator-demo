// 获取文件的MIME类型
export const getFileType = (fileExtension) => {
  if (!fileExtension) {
    return 'application/octet-stream';
  }
  
  const extension = fileExtension.toLowerCase();
  
  // MIME类型映射
  const mimeTypes = {
    // 文档类型
    'txt': 'text/plain',
    'md': 'text/markdown',
    'markdown': 'text/markdown',
    'pdf': 'application/pdf',
    'html': 'text/html',
    'htm': 'text/html',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc': 'application/msword',
    'csv': 'text/csv',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'ppt': 'application/vnd.ms-powerpoint',
    'xml': 'application/xml',
    'epub': 'application/epub+zip',
    
    // 图片类型
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // 音频类型
    'mp3': 'audio/mpeg',
    'm4a': 'audio/m4a',
    'wav': 'audio/wav',
    'webm': 'audio/webm',
    'amr': 'audio/amr',
    
    // 视频类型
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'mpeg': 'video/mpeg',
    'mpga': 'audio/mpeg',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};

// 获取Dify API兼容的文件类型
export const getDifyFileType = (fileExtension) => {
  if (!fileExtension) {
    return 'document';
  }
  
  const extension = fileExtension.toLowerCase();
  
  // 图片类型
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }
  
  // 音频类型
  if (['mp3', 'm4a', 'wav', 'webm', 'amr'].includes(extension)) {
    return 'audio';
  }
  
  // 视频类型
  if (['mp4', 'mov', 'mpeg', 'mpga'].includes(extension)) {
    return 'video';
  }
  
  // 文档类型
  if (['txt', 'md', 'markdown', 'pdf', 'html', 'xlsx', 'xls', 'docx', 'csv', 'eml', 'msg', 'pptx', 'ppt', 'xml', 'epub'].includes(extension)) {
    return 'document';
  }
  
  // 默认为自定义类型
  return 'custom';
};

// 获取文件扩展名
export const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
};

// 支持的语言列表
export const supportedLanguages = [
  'Chinese',
  'English',
  'Japanese',
  'Korean',
  'French',
  'German',
  'Spanish',
  'Italian',
  'Russian',
  'Portuguese',
  'Arabic',
  'Dutch',
  'Swedish',
  'Turkish',
  'Hebrew',
  'Thai',
  'Vietnamese',
  'Greek',
];

// 获取文件大小的可读表示
export const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}; 