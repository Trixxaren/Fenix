import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profiles } from "../../data/seed";
import { Relation } from "../../data/models";
import { useStore } from "../../state/provider";
import {
  Button,
  Chip,
  Copy,
  Empty,
  Screen,
  SectionLabel,
} from "../../components/ui";
import { PersonRow } from "../../components/person-row";
import { colors } from "../../theme";
export default function Friends() {
  const { state, commit, busy, notify } = useStore();
  const [tab, setTab] = useState<Relation>("friend");
  const insets = useSafeAreaInsets();
  const people = profiles.filter(
    (p) => state.relations[p.id] === tab && !state.blocked.includes(p.id),
  );
  async function update(id: string, value?: "friend" | "outgoing") {
    if (await commit({ type: "relation", id, value }))
      notify(
        value ? "Ny vän! Dags att säga hej?" : "Förfrågan har tagits bort.",
      );
  }
  return (
    <Screen>
      <View style={{ paddingTop: insets.top, gap: 12 }}>
        <SectionLabel>DET BÖRJAR MED ETT HEJ</SectionLabel>
        <Copy variant="hero">Ditt sportgäng.</Copy>
        <Copy style={{ color: colors.muted }}>
          Nya bekantskaper. Fler anledningar att ses.
        </Copy>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {(["friend", "incoming", "outgoing"] as const).map((key) => (
          <Chip
            key={key}
            title={`${key === "friend" ? "Vänner" : key === "incoming" ? "Inkommande" : "Skickade"} ${Object.values(state.relations).filter((v) => v === key).length}`}
            selected={tab === key}
            onPress={() => setTab(key)}
          />
        ))}
      </View>
      {people.length ? (
        people.map((person) => (
          <View
            key={person.id}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
              paddingBottom: 16,
              gap: 8,
            }}
          >
            <PersonRow person={person} />
            {tab === "incoming" && (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Button
                  title="Acceptera"
                  style={{ flex: 1 }}
                  disabled={busy}
                  onPress={() => void update(person.id, "friend")}
                />
                <Button
                  title="Avböj"
                  style={{ flex: 1 }}
                  variant="secondary"
                  disabled={busy}
                  onPress={() => void update(person.id)}
                />
              </View>
            )}
            {tab === "outgoing" && (
              <Button
                title="Väntar på svar · Ångra"
                variant="secondary"
                disabled={busy}
                onPress={() => void update(person.id)}
              />
            )}
          </View>
        ))
      ) : (
        <Empty
          title={
            tab === "friend"
              ? "Här finns plats för ditt gäng"
              : "Inga förfrågningar just nu"
          }
          body={
            tab === "friend"
              ? "Hitta någon i Upptäck och skicka en vänförfrågan."
              : "När en förfrågan finns i ditt demo dyker den upp här."
          }
        />
      )}
      <Copy variant="small" style={{ color: colors.muted }}>
        Ömsesidiga vänskaper · Alla relationer är lokala demodata.
      </Copy>
    </Screen>
  );
}
