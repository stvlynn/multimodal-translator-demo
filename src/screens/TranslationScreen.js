import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../context/AppContext';
import { translateText, uploadFile, translateFile } from '../services/api';
import { getFileType, getFileExtension, getDifyFileType } from '../utils/helpers';

const TranslationScreen = ({ navigation }) => {
  const {
    settings,
    translationState,
    updateTranslationState,
  } = useAppContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 处理文本输入变化
  const handleInputChange = (text) => {
    updateTranslationState({ inputText: text });
  };

  // 处理输入语言变化
  const handleInputLangChange = (text) => {
    updateTranslationState({ inputLang: text });
  };

  // 处理输出语言变化
  const handleOutputLangChange = (text) => {
    updateTranslationState({ outputLang: text });
  };

  // 处理语言切换
  const switchLanguages = () => {
    updateTranslationState({
      inputLang: translationState.outputLang,
      outputLang: translationState.inputLang,
      inputText: translationState.outputText,
      outputText: translationState.inputText,
    });
  };

  // 处理翻译
  const handleTranslate = async () => {
    if (!settings.apiKey) {
      Alert.alert('错误', '请先在设置中配置API密钥');
      return;
    }

    if (!translationState.inputText.trim()) {
      Alert.alert('错误', '请输入要翻译的文本');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const translatedText = await translateText(
        translationState.inputText,
        translationState.inputLang,
        translationState.outputLang,
        settings.mode,
        settings.baseUrl,
        settings.apiKey
      );

      updateTranslationState({ outputText: translatedText });
    } catch (err) {
      setError('翻译失败: ' + (err.message || '未知错误'));
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理文档选择
  const pickDocument = async () => {
    if (!settings.apiKey) {
      Alert.alert('错误', '请先在设置中配置API密钥');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }
      
      const asset = result.assets[0];
      processFile(asset);
    } catch (err) {
      Alert.alert('错误', '无法选择文档: ' + err.message);
    }
  };

  // 处理图片选择
  const pickImage = async () => {
    if (!settings.apiKey) {
      Alert.alert('错误', '请先在设置中配置API密钥');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) {
        return;
      }
      
      const asset = result.assets[0];
      processFile(asset);
    } catch (err) {
      Alert.alert('错误', '无法选择图片: ' + err.message);
    }
  };

  // 处理文件上传和翻译
  const processFile = async (fileAsset) => {
    try {
      setIsLoading(true);
      setError(null);

      // 准备文件对象
      const fileUri = fileAsset.uri;
      const fileName = fileAsset.name || fileUri.split('/').pop();
      const fileExtension = getFileExtension(fileName);
      const mimeType = getFileType(fileExtension);
      const difyFileType = getDifyFileType(fileExtension);
      
      console.log('处理文件:', {
        名称: fileName,
        扩展名: fileExtension,
        MIME类型: mimeType,
        Dify文件类型: difyFileType,
        URI: fileUri.substring(0, 50) + '...',
        尺寸: fileAsset.size || '未知'
      });
      
      // 创建更简单的文件对象
      const fileToUpload = {
        uri: fileUri,
        name: fileName,
        type: mimeType
      };
      
      if (!settings.apiKey) {
        setError('API密钥未设置，请在设置中配置');
        setIsLoading(false);
        return;
      }

      // 上传文件
      try {
        // 在Web上使用Fetch API直接获取文件内容
        if (Platform.OS === 'web') {
          const response = await fetch(fileUri);
          const blob = await response.blob();
          const file = new File([blob], fileName, { type: mimeType });
          
          const uploadResponse = await uploadFile(
            file,
            settings.baseUrl, 
            settings.apiKey
          );
          
          if (!uploadResponse || !uploadResponse.id) {
            throw new Error('无法获取上传文件ID');
          }
          
          const fileId = uploadResponse.id;
          
          // 使用Dify文件类型
          console.log(`准备翻译文件，类型: ${difyFileType}, ID: ${fileId}`);
          
          const translatedText = await translateFile(
            fileId,
            difyFileType,
            translationState.inputLang,
            translationState.outputLang,
            settings.mode,
            settings.baseUrl,
            settings.apiKey
          );
  
          updateTranslationState({
            outputText: translatedText,
            inputText: `[文件: ${fileName}]`,
          });
        } else {
          // 在移动设备上使用React Native方式
          const uploadResponse = await uploadFile(
            fileToUpload,
            settings.baseUrl, 
            settings.apiKey
          );
          
          if (!uploadResponse || !uploadResponse.id) {
            throw new Error('无法获取上传文件ID');
          }
          
          const fileId = uploadResponse.id;
          
          // 使用Dify文件类型
          console.log(`准备翻译文件，类型: ${difyFileType}, ID: ${fileId}`);
          
          const translatedText = await translateFile(
            fileId,
            difyFileType,
            translationState.inputLang,
            translationState.outputLang,
            settings.mode,
            settings.baseUrl,
            settings.apiKey
          );
  
          updateTranslationState({
            outputText: translatedText,
            inputText: `[文件: ${fileName}]`,
          });
        }
      } catch (err) {
        console.error('API错误:', err);
        setError(err.message || '文件处理失败');
      }
    } catch (err) {
      setError('文件处理失败: ' + (err.message || '未知错误'));
      console.error('文件处理错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.languageContainer}>
            <TextInput
              style={styles.languageInput}
              value={translationState.inputLang}
              onChangeText={handleInputLangChange}
              placeholder="输入语言"
              placeholderTextColor="#999"
            />
          </View>
          
          <TouchableOpacity onPress={switchLanguages} style={styles.switchButton}>
            <Ionicons name="swap-horizontal" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <View style={styles.languageContainer}>
            <TextInput
              style={styles.languageInput}
              value={translationState.outputLang}
              onChangeText={handleOutputLangChange}
              placeholder="输出语言"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="输入要翻译的文本..."
            value={translationState.inputText}
            onChangeText={handleInputChange}
          />
          <View style={styles.inputActions}>
            <TouchableOpacity onPress={pickDocument} style={styles.iconButton}>
              <Ionicons name="document-text" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
              <Ionicons name="image" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.translateButton, isLoading && styles.disabledButton]}
          onPress={handleTranslate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Ionicons name="arrow-down" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <View style={styles.outputContainer}>
          <TextInput
            style={styles.output}
            multiline
            editable={false}
            placeholder="翻译结果将显示在这里..."
            value={translationState.outputText}
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.modeIndicator}>
          <Text style={styles.modeText}>
            模式: {settings.mode === 'fast' ? '快速' : '专注'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  languageContainer: {
    flex: 2,
    alignItems: 'center',
  },
  languageInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    textAlign: 'center',
    width: '80%',
  },
  switchButton: {
    padding: 10,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    height: 150,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  translateButton: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#bbb',
  },
  outputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  output: {
    height: 150,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    margin: 15,
  },
  errorText: {
    color: '#d32f2f',
  },
  modeIndicator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modeText: {
    color: '#666',
    fontSize: 14,
  },
});

export default TranslationScreen; 