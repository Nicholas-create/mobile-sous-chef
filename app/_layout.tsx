import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../context/AppContext';
import '../global.css';

LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="planner" options={{ presentation: 'card', headerShown: true, title: 'Planner' }} />
          <Stack.Screen name="scavenger" options={{ presentation: 'card', headerShown: true, title: 'Fridge Scavenger' }} />
          <Stack.Screen name="daily-menu" options={{ presentation: 'card', headerShown: true, title: 'Daily Menu' }} />
          <Stack.Screen name="cookbook" options={{ presentation: 'card', headerShown: true, title: 'Cookbook' }} />
          <Stack.Screen name="recipe/[id]" options={{ presentation: 'card', headerShown: false }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
