import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 创建上下文
const AppContext = createContext();

// 默认设置
const DEFAULT_SETTINGS = {
  baseUrl: 'https://api.dify.ai/v1',
  apiKey: '',
  mode: 'fast', // 'fast' 或 'focus'
};

// 默认翻译状态
const DEFAULT_TRANSLATION_STATE = {
  inputText: '',
  outputText: '',
  inputLang: '中文',
  outputLang: '英语',
};

// 提供者组件
export const AppProvider = ({ children }) => {
  // 设置状态
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [translationState, setTranslationState] = useState(DEFAULT_TRANSLATION_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // 加载保存的设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
        
        const savedTranslationState = await AsyncStorage.getItem('translationState');
        if (savedTranslationState) {
          setTranslationState(JSON.parse(savedTranslationState));
        }
      } catch (error) {
        console.error('加载设置失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 更新设置
  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  };

  // 更新翻译状态
  const updateTranslationState = async (newState) => {
    try {
      const updatedState = { ...translationState, ...newState };
      setTranslationState(updatedState);
      await AsyncStorage.setItem('translationState', JSON.stringify(updatedState));
    } catch (error) {
      console.error('保存翻译状态失败:', error);
    }
  };

  // 提供上下文值
  const contextValue = {
    settings,
    updateSettings,
    translationState,
    updateTranslationState,
    isLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义钩子，用于访问上下文
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext必须在AppProvider内部使用');
  }
  return context;
}; 