import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Copy, Screen, SectionLabel } from "../components/ui";
import { Portrait } from "../components/portrait";
import { useStore } from "../state/provider";
import { colors } from "../theme";

export default function Welcome() {
  const { commit, busy, state } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <View style={{ paddingTop: insets.top + 16, gap: 28 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Copy variant="title" style={{ color: colors.primary }}>
            fenix↗
          </Copy>
          <SectionLabel>MER ÄN EN MATCH</SectionLabel>
        </View>
        <View
          style={{
            height: 260,
            flexDirection: "row",
            gap: 12,
            paddingVertical: 12,
          }}
        >
          <Portrait
            photo="portrait-1"
            name="Elin"
            style={{
              flex: 1,
              borderRadius: 96,
              transform: [{ rotate: "-7deg" }],
            }}
          />
          <Portrait
            photo="portrait-2"
            name="Oscar"
            style={{
              flex: 1,
              borderRadius: 96,
              transform: [{ rotate: "7deg" }],
              marginTop: 36,
            }}
          />
        </View>
        <View style={{ gap: 16 }}>
          <Copy variant="hero">
            Bra sport.{"\n"}Ännu bättre{"\n"}sällskap.
          </Copy>
          <Copy style={{ color: colors.muted }}>
            Hitta din nästa tennispartner, löparkompis eller någon att missa en
            putt med.
          </Copy>
        </View>
        <View style={{ gap: 10 }}>
          <Button
            title={
              state.onboarded
                ? "Fortsätt med min profil"
                : "Hitta ditt sportgäng →"
            }
            loading={busy}
            onPress={() =>
              state.onboarded
                ? void commit({ type: "login" })
                : router.push("/onboarding")
            }
          />
          <Button
            title="Utforska med demoprofil"
            variant="secondary"
            disabled={busy}
            onPress={() => void commit({ type: "login" })}
          />
          <Copy
            variant="small"
            style={{ color: colors.muted, textAlign: "center" }}
          >
            Lokalt demoläge · Inga lösenord behövs.{"\n"}Profiler och
            konversationer är fiktiva.
          </Copy>
        </View>
      </View>
    </Screen>
  );
}
