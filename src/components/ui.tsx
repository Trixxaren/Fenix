import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors, radius, typography } from "../theme";

export function Copy({
  variant = "body",
  style,
  ...props
}: TextProps & { variant?: keyof typeof typography }) {
  return (
    <Text
      {...props}
      style={[{ color: colors.ink }, typography[variant], style]}
    />
  );
}
export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
        ? colors.sage
        : variant === "danger"
          ? colors.soft
          : "transparent";
  const ink =
    variant === "primary"
      ? "#FFFFFF"
      : variant === "danger"
        ? colors.danger
        : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{
        disabled: !!(disabled || loading),
        busy: !!loading,
      }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 48,
          padding: 14,
          paddingHorizontal: 20,
          borderRadius: radius.full,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={ink} />
      ) : (
        <Copy style={{ color: ink, fontWeight: "700", textAlign: "center" }}>
          {title}
        </Copy>
      )}
    </Pressable>
  );
}
export function Chip({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 11,
        borderWidth: 1,
        borderColor: selected ? colors.green : colors.line,
        borderRadius: radius.full,
        backgroundColor: selected ? colors.green : colors.paper,
        opacity: pressed ? 0.65 : 1,
        justifyContent: "center",
      })}
    >
      <Copy
        variant="small"
        style={{ color: selected ? "#FFFFFF" : colors.ink, fontWeight: "600" }}
      >
        {title}
      </Copy>
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Copy style={{ fontWeight: "600" }}>{label}</Copy>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        {...props}
        style={[
          {
            borderWidth: 1,
            borderColor: colors.line,
            padding: 16,
            borderRadius: radius.sm,
            color: colors.ink,
            fontSize: 16,
            backgroundColor: colors.paper,
            minHeight: 52,
          },
          props.multiline && { minHeight: 100, textAlignVertical: "top" },
          props.style,
        ]}
      />
    </View>
  );
}
export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 48,
          gap: 24,
          width: "100%",
          maxWidth: 640,
          alignSelf: "center",
        }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={{ paddingVertical: 40, alignItems: "center", gap: 16 }}>
      <View
        style={{
          height: 64,
          width: 64,
          borderRadius: 32,
          backgroundColor: colors.sage,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Copy variant="title" style={{ color: colors.green }}>
          ↗
        </Copy>
      </View>
      <Copy variant="heading" style={{ textAlign: "center" }}>
        {title}
      </Copy>
      <Copy style={{ textAlign: "center", color: colors.muted }}>{body}</Copy>
      {action}
    </View>
  );
}
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Copy variant="label" style={{ color: colors.muted }}>
      {children}
    </Copy>
  );
}
