/**
 * SMANV EduERP Root Navigation & Provider Layout
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useTheme } from '../store/ThemeContext';
import { AuthProvider } from '../store/AuthContext';
import { NotificationProvider } from '../store/NotificationContext';
import { AIProvider } from '../store/AIContext';

function RootNavigator() {
  const { isDarkMode, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register-org" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admissions" />
        <Stack.Screen name="students" />
        <Stack.Screen name="staff" />
        <Stack.Screen name="attendance" />
        <Stack.Screen name="assignments" />
        <Stack.Screen name="examinations" />
        <Stack.Screen name="fees" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="ai-assistant" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="help" />
        <Stack.Screen name="about" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AIProvider>
              <PaperProvider>
                <RootNavigator />
              </PaperProvider>
            </AIProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
