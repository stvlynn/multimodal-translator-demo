import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TranslationScreen from '../screens/TranslationScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Translation"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen
        name="Translation"
        component={TranslationScreen}
        options={({ navigation }) => ({
          title: '多模态翻译',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={{ padding: 8 }}
            >
              <Ionicons name="settings-outline" size={22} color="#007AFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '设置',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 