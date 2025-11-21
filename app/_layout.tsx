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
          <Stack.Screen name="index" />
          <Stack.Screen name="planner" options={{ presentation: 'card', headerShown: true, title: 'Planner' }} />
          <Stack.Screen name="scavenger" options={{ presentation: 'card', headerShown: true, title: 'Fridge Scavenger' }} />
          <Stack.Screen name="recipe/[id]" options={{ presentation: 'card', headerShown: false }} />
          <Stack.Screen name="shopping-list" options={{ presentation: 'modal', title: 'Shopping List', headerShown: true }} />
          <Stack.Screen name="preferences" options={{ presentation: 'modal', title: 'Settings', headerShown: true }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
