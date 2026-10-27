import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StoreProvider, useStore } from "../state/provider";
import { Copy } from "../components/ui";
import { colors } from "../theme";

function Navigation() {
  const { state, notice } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.ink,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        <Stack.Protected guard={!state.loggedIn}>
          <Stack.Screen
            name="welcome"
            options={{ title: "Fenix", headerShown: false }}
          />
          <Stack.Screen
            name="onboarding"
            options={{ title: "Din start på Fenix" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={state.loggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="person/[id]" options={{ title: "Profil" }} />
          <Stack.Screen
            name="conversation/[id]"
            options={{ title: "Konversation" }}
          />
          <Stack.Screen
            name="edit-profile"
            options={{ title: "Redigera profil" }}
          />
          <Stack.Screen
            name="preview"
            options={{ title: "Så ser andra din profil" }}
          />
        </Stack.Protected>
      </Stack>
      {notice ? (
        <View
          accessibilityRole="alert"
          style={{
            position: "absolute",
            bottom: insets.bottom + 80,
            left: 20,
            right: 20,
            padding: 16,
            backgroundColor: colors.ink,
            borderRadius: 16,
          }}
        >
          <Copy style={{ color: "#FFFFFF" }}>{notice}</Copy>
        </View>
      ) : null}
    </View>
  );
}
export default function Layout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Navigation />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
