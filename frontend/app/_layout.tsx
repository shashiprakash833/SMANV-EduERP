/**
 * SMANV EduERP Root Navigation & Provider Layout
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useTheme } from '@/store/ThemeContext';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { NotificationProvider } from '@/store/NotificationContext';
import { AIProvider } from '@/store/AIContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

function RootNavigator() {
  const { isDarkMode, colors } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Global Protected Route Enforcer
  useProtectedRoute(isAuthenticated, isLoading);

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
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="(organization)" />
        <Stack.Screen name="(student)" />
        <Stack.Screen name="(staff)" />
        <Stack.Screen name="(finance)" />
        <Stack.Screen name="(profile)" />
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
