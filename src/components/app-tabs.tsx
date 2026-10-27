import { NativeTabs } from "expo-router/unstable-native-tabs";
import { colors } from "../theme";
export function AppTabs() {
  return (
    <NativeTabs tintColor={colors.primary} backgroundColor={colors.bg}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="safari" md="explore" />
        <NativeTabs.Trigger.Label>Upptäck</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="friends">
        <NativeTabs.Trigger.Icon sf="person.2" md="group" />
        <NativeTabs.Trigger.Label>Vänner</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chats">
        <NativeTabs.Trigger.Icon
          sf="bubble.left.and.bubble.right"
          md="chat_bubble_outline"
        />
        <NativeTabs.Trigger.Label>Chatt</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" />
        <NativeTabs.Trigger.Label>Profil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
