import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../../state/provider";
import { profiles } from "../../data/seed";
import { Copy, Empty, Screen, SectionLabel, Button } from "../../components/ui";
import { Portrait } from "../../components/portrait";
import { colors } from "../../theme";
export default function Chats() {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const conversations = Object.entries(state.conversations)
    .filter(([id, messages]) => messages.length && !state.blocked.includes(id))
    .sort((a, b) => b[1].at(-1)!.time.localeCompare(a[1].at(-1)!.time));
  return (
    <Screen>
      <View style={{ paddingTop: insets.top, gap: 12 }}>
        <SectionLabel>EN MATCH BÖRJAR MED ETT SAMTAL</SectionLabel>
        <Copy variant="hero">Säg hej.</Copy>
        <Copy style={{ color: colors.muted }}>
          Ni behöver inte vara vänner för att prata.
        </Copy>
      </View>
      <View
        style={{ padding: 16, backgroundColor: colors.sage, borderRadius: 16 }}
      >
        <Copy variant="small">
          Demochatt · Meddelanden sparas bara här. Ingen riktig person tar emot
          dem.
        </Copy>
      </View>
      {conversations.length ? (
        conversations.map(([id, messages]) => {
          const person = profiles.find((p) => p.id === id);
          if (!person) return null;
          const last = messages.at(-1)!;
          const unread =
            last.sender === "them" &&
            (!state.readAt[id] || state.readAt[id] < last.time);
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={`Öppna chatt med ${person.name}`}
              onPress={() =>
                router.push({ pathname: "/conversation/[id]", params: { id } })
              }
              style={({ pressed }) => ({
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
                flexDirection: "row",
                gap: 14,
                alignItems: "center",
                opacity: pressed ? 0.65 : 1,
              })}
            >
              <Portrait
                name={person.name}
                photo={person.photo}
                style={{ width: 68, height: 68, borderRadius: 26 }}
              />
              <View style={{ flex: 1, gap: 4 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <Copy style={{ fontWeight: "700", flex: 1 }}>
                    {person.name.split(" ")[0]}
                  </Copy>
                  <Copy variant="small" style={{ color: colors.muted }}>
                    {new Date(last.time).toLocaleDateString("sv-SE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Copy>
                </View>
                <Copy
                  variant="small"
                  numberOfLines={2}
                  style={{ color: colors.muted }}
                >
                  {last.sender === "me" ? "Du: " : ""}
                  {last.text}
                </Copy>
              </View>
              {unread && (
                <View
                  accessibilityLabel="Oläst demomeddelande"
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 5,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </Pressable>
          );
        })
      ) : (
        <Empty
          title="Ditt första hej väntar"
          body="Öppna en profil i Upptäck och starta en konversation."
          action={
            <Button title="Till Upptäck" onPress={() => router.navigate("/")} />
          }
        />
      )}
    </Screen>
  );
}
