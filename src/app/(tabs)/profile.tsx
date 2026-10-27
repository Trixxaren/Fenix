import { View } from "react-native";
import { confirmAction } from "../../utils/confirm";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../../state/provider";
import { Button, Copy, Screen, SectionLabel } from "../../components/ui";
import { ProfileDetail } from "../../components/profile-detail";
import { colors } from "../../theme";
export default function MyProfile() {
  const { state, commit, busy } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <View style={{ paddingTop: insets.top, gap: 12 }}>
        <SectionLabel>DITT EGET HÖRN</SectionLabel>
        <Copy variant="hero">Hej, {state.profile.name.split(" ")[0]}.</Copy>
      </View>
      <Button
        title="Redigera min profil"
        onPress={() => router.push("/edit-profile")}
      />
      <Button
        title="Visa profilen som andra ser den"
        variant="secondary"
        onPress={() => router.push("/preview")}
      />
      <ProfileDetail person={state.profile} />
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.line,
          paddingTop: 24,
          gap: 16,
        }}
      >
        <SectionLabel>OM DEMOT</SectionLabel>
        <Copy variant="small" style={{ color: colors.muted }}>
          Alla profiler är fiktiva. Dina uppgifter, vänrelationer och
          meddelanden lagras bara på denna enhet. Ingen backend eller verklig
          inloggning används.
        </Copy>
        <Button
          title="Logga ut från demoläget"
          variant="secondary"
          disabled={busy}
          onPress={() => void commit({ type: "logout" })}
        />
        <Button
          title="Återställ all demodata"
          variant="danger"
          disabled={busy}
          onPress={() =>
            confirmAction(
              "Börja om från början?",
              "Din profil, lokala meddelanden och ändrade vänrelationer ersätts av ursprungliga demodata.",
              "Återställ",
              () => void commit({ type: "reset" }),
            )
          }
        />
      </View>
    </Screen>
  );
}
