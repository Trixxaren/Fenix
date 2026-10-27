import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../../state/provider";
import { profiles } from "../../data/seed";
import { Button, Copy, Empty } from "../../components/ui";
import { Portrait } from "../../components/portrait";
import { Message } from "../../data/models";
import { colors } from "../../theme";
export default function Conversation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, commit, busy, notify } = useStore();
  const [text, setText] = useState("");
  const list = useRef<FlatList<Message>>(null);
  const insets = useSafeAreaInsets();
  const person = profiles.find((p) => p.id === id);
  const messages = state.conversations[id] ?? [];
  const lastTime = messages.at(-1)?.time;
  useEffect(() => {
    if (lastTime && state.readAt[id] !== lastTime && !busy)
      void commit({ type: "read", id, time: lastTime });
  }, [id, lastTime, state.readAt, busy, commit]);
  if (!person)
    return (
      <Empty
        title="Konversationen finns inte"
        body="Öppna en profil för att börja prata."
      />
    );
  const blocked = state.blocked.includes(id);
  async function send() {
    const body = text.trim();
    if (!body || busy || blocked) return;
    if (
      await commit({
        type: "message",
        id,
        message: {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: "me",
          text: body,
          time: new Date().toISOString(),
        },
      })
    ) {
      setText("");
      notify("Meddelandet är sparat lokalt i demot.");
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 44 : 0}
    >
      <Stack.Screen options={{ title: person.name.split(" ")[0] }} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Visa ${person.name}s profil`}
        onPress={() =>
          router.push({ pathname: "/person/[id]", params: { id } })
        }
        style={{
          flexDirection: "row",
          gap: 12,
          paddingHorizontal: 24,
          paddingVertical: 12,
          alignItems: "center",
        }}
      >
        <Portrait
          photo={person.photo}
          name={person.name}
          style={{ width: 44, height: 44, borderRadius: 18 }}
        />
        <View>
          <Copy style={{ fontWeight: "700" }}>{person.name}</Copy>
          <Copy variant="small" style={{ color: colors.muted }}>
            Visa profil ↗
          </Copy>
        </View>
      </Pressable>
      <Copy
        variant="small"
        style={{ textAlign: "center", color: colors.muted, padding: 12 }}
      >
        Lokalt demo · Ingen mottagare eller leveransstatus
      </Copy>
      <FlatList
        ref={list}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 20, gap: 16, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          list.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <Empty
            title={`Säg hej till ${person.name.split(" ")[0]}`}
            body="Fråga om en favoritsport eller föreslå en första match."
          />
        }
        renderItem={({ item }) => (
          <View
            style={{
              maxWidth: "85%",
              alignSelf: item.sender === "me" ? "flex-end" : "flex-start",
              gap: 5,
            }}
          >
            <View
              style={{
                padding: 16,
                borderRadius: 20,
                borderBottomRightRadius: item.sender === "me" ? 4 : 20,
                borderBottomLeftRadius: item.sender === "them" ? 4 : 20,
                backgroundColor:
                  item.sender === "me" ? colors.green : colors.paper,
              }}
            >
              <Copy
                selectable
                style={{ color: item.sender === "me" ? "#FFFFFF" : colors.ink }}
              >
                {item.text}
              </Copy>
            </View>
            <Copy
              variant="small"
              style={{
                color: colors.muted,
                alignSelf: item.sender === "me" ? "flex-end" : "flex-start",
              }}
            >
              {new Date(item.time).toLocaleDateString("sv-SE", {
                day: "numeric",
                month: "short",
              })}{" "}
              ·{" "}
              {new Date(item.time).toLocaleTimeString("sv-SE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Copy>
          </View>
        )}
      />
      {blocked ? (
        <Copy style={{ padding: 24, color: colors.danger }}>
          Profilen är blockerad i ditt demo.
        </Copy>
      ) : (
        <View
          style={{
            padding: 16,
            paddingBottom: Math.max(16, insets.bottom),
            backgroundColor: colors.paper,
            borderTopWidth: 1,
            borderTopColor: colors.line,
            gap: 8,
          }}
        >
          <View
            style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}
          >
            <TextInput
              accessibilityLabel="Ditt meddelande"
              placeholder="Skriv ett hej…"
              placeholderTextColor={colors.muted}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1000}
              style={{
                flex: 1,
                minHeight: 48,
                maxHeight: 140,
                padding: 14,
                fontSize: 16,
                color: colors.ink,
                borderRadius: 20,
                backgroundColor: colors.bg,
              }}
            />
            <Button
              title="Skicka"
              loading={busy}
              disabled={!text.trim()}
              onPress={() => void send()}
            />
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
