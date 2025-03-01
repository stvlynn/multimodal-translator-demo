import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const SettingsScreen = () => {
  const { settings, updateSettings } = useAppContext();
  
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [isFastMode, setIsFastMode] = useState(settings.mode === 'fast');
  const [showApiKey, setShowApiKey] = useState(false);

  // 当设置改变时更新本地状态
  useEffect(() => {
    setBaseUrl(settings.baseUrl);
    setApiKey(settings.apiKey);
    setIsFastMode(settings.mode === 'fast');
  }, [settings]);

  // 保存设置
  const saveSettings = () => {
    if (!baseUrl.trim()) {
      Alert.alert('错误', 'API基础URL不能为空');
      return;
    }

    if (!apiKey.trim()) {
      Alert.alert('警告', '未设置API密钥，应用功能将受限');
    }

    updateSettings({
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      mode: isFastMode ? 'fast' : 'focus',
    });

    Alert.alert('成功', '设置已保存');
  };

  // 重置为默认设置
  const resetSettings = () => {
    Alert.alert(
      '重置设置',
      '确定要恢复默认设置吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: () => {
            setBaseUrl('https://api.dify.ai/v1');
            setApiKey('');
            setIsFastMode(true);
            updateSettings({
              baseUrl: 'https://api.dify.ai/v1',
              apiKey: '',
              mode: 'fast',
            });
            Alert.alert('成功', '已恢复默认设置');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>应用设置</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API 设置</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dify API 基础 URL</Text>
            <TextInput
              style={styles.input}
              value={baseUrl}
              onChangeText={setBaseUrl}
              placeholder="https://api.dify.ai/v1"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>API 密钥</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="输入你的 API 密钥"
                secureTextEntry={!showApiKey}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowApiKey(!showApiKey)}
              >
                <Ionicons
                  name={showApiKey ? 'eye-off' : 'eye'}
                  size={24}
                  color="#007AFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>翻译设置</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>翻译模式</Text>
            <View style={styles.switchGroup}>
              <Text style={[styles.modeText, !isFastMode && styles.activeMode]}>
                专注
              </Text>
              <Switch
                value={isFastMode}
                onValueChange={setIsFastMode}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isFastMode ? '#007AFF' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
              />
              <Text style={[styles.modeText, isFastMode && styles.activeMode]}>
                快速
              </Text>
            </View>
          </View>
          
          <View style={styles.modeDescription}>
            <Text style={styles.modeDescriptionText}>
              {isFastMode
                ? '快速模式：更快的翻译速度，适合日常使用'
                : '专注模式：更高的翻译质量，适合正式场合'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={saveSettings}
          >
            <Text style={styles.buttonText}>保存设置</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetSettings}
          >
            <Text style={[styles.buttonText, styles.resetButtonText]}>
              恢复默认
            </Text>
          </TouchableOpacity>
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
  headerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  switchContainer: {
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    marginHorizontal: 10,
  },
  modeText: {
    fontSize: 14,
    color: '#777',
  },
  activeMode: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  modeDescription: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  modeDescriptionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  buttonGroup: {
    marginHorizontal: 15,
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  resetButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  resetButtonText: {
    color: '#777',
  },
});

export default SettingsScreen; 