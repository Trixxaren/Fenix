import { Tabs } from "expo-router";
import { Copy } from "./ui";
import { colors } from "../theme";
export function AppTabs() {
  const icons = { index: "◉", friends: "♧", chats: "▤", profile: "◎" };
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.line,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ color }) => (
          <Copy style={{ color, fontSize: 22 }}>
            {icons[route.name as keyof typeof icons]}
          </Copy>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Upptäck" }} />
      <Tabs.Screen name="friends" options={{ title: "Vänner" }} />
      <Tabs.Screen name="chats" options={{ title: "Chatt" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
