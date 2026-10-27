import { Alert } from "react-native";
export function confirmAction(
  title: string,
  body: string,
  action: string,
  onConfirm: () => void,
) {
  if (process.env.EXPO_OS === "web") {
    if (window.confirm(`${title}\n\n${body}`)) onConfirm();
  } else
    Alert.alert(title, body, [
      { text: "Avbryt", style: "cancel" },
      { text: action, style: "destructive", onPress: onConfirm },
    ]);
}
