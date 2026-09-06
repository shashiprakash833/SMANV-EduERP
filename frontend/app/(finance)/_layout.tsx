import { Stack } from 'expo-router';

export default function FinanceGroupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
