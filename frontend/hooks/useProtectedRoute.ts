/**
 * SMANV EduERP Protected Routes Navigation Hook
 * Enforces authenticated routing boundaries in Expo Router
 * Developed by SMANV Info Tech Private Limited
 */

import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

export function useProtectedRoute(isAuthenticated: boolean, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const rootNavState = useRootNavigationState();

  useEffect(() => {
    // Do not redirect while navigation tree is mounting or auth check is in flight
    if (!rootNavState?.key || isLoading) return;

    const firstSegment = segments[0] as string | undefined;

    const isAuthRoute =
      firstSegment === '(auth)' ||
      firstSegment === 'welcome' ||
      firstSegment === 'login' ||
      firstSegment === 'register-org' ||
      firstSegment === 'forgot-password' ||
      segments.includes('welcome') ||
      segments.includes('login') ||
      segments.includes('register-org') ||
      segments.includes('forgot-password');

    const isSplash = !firstSegment || firstSegment === 'index';

    if (!isAuthenticated && !isAuthRoute && !isSplash) {
      // Redirect unauthenticated users attempting to access protected pages
      router.replace('/welcome');
    } else if (isAuthenticated && isAuthRoute) {
      // Redirect authenticated users trying to access login/register back to Dashboard
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, rootNavState?.key]);
}

export default useProtectedRoute;
