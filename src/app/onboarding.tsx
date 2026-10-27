import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { BasicsForm, SportsForm } from "../components/profile-form";
import { Button, Copy, Field, Screen, SectionLabel } from "../components/ui";
import { useStore } from "../state/provider";
import { validateProfile } from "../utils/people";
import { colors } from "../theme";

export default function Onboarding() {
  const { state, commit, busy } = useStore();
  const [draft, setDraft] = useState({
    ...state.profile,
    name: "",
    age: 0,
    sports: {},
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const titles = [
    "Först, vem är du?",
    "Vad vill du spela?",
    "Ditt nästa gäng väntar.",
  ];
  async function next() {
    const validation = validateProfile(draft);
    if (
      step === 0 &&
      (!draft.name.trim() ||
        draft.name.trim().length < 2 ||
        draft.age < 18 ||
        draft.age > 100 ||
        !draft.photo)
    ) {
      setError("Ange namn, en ålder mellan 18 och 100 år och välj en bild.");
      return;
    }
    if (step >= 1 && validation) {
      setError(validation);
      return;
    }
    setError("");
    if (step < 2) setStep(step + 1);
    else if (
      await commit({
        type: "onboard",
        profile: { ...draft, name: draft.name.trim() },
      })
    )
      router.replace("/");
  }
  return (
    <Screen>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              height: 5,
              flex: 1,
              borderRadius: 3,
              backgroundColor: i <= step ? colors.primary : colors.line,
            }}
          />
        ))}
      </View>
      <SectionLabel>STEG {step + 1} AV 3 · DEMOPROFIL</SectionLabel>
      <Copy variant="hero">{titles[step]}</Copy>
      <Copy style={{ color: colors.muted }}>
        {
          [
            "En bild och ett namn gör det lättare att säga hej.",
            "Välj en eller flera. Alla nivåer är välkomna.",
            "Du kan alltid fylla på din profil senare.",
          ][step]
        }
      </Copy>
      {step === 0 ? (
        <BasicsForm draft={draft} onChange={setDraft} />
      ) : step === 1 ? (
        <SportsForm draft={draft} onChange={setDraft} />
      ) : (
        <View style={{ gap: 24 }}>
          <View
            style={{
              backgroundColor: colors.sage,
              padding: 24,
              borderRadius: 24,
              gap: 8,
            }}
          >
            <Copy variant="title">Hej {draft.name}!</Copy>
            <Copy>
              {Object.keys(draft.sports).join(" · ")} i {draft.area}
            </Copy>
          </View>
          <Field
            label="En kort bio (frivilligt)"
            value={draft.bio}
            multiline
            maxLength={350}
            onChangeText={(bio) => setDraft({ ...draft, bio })}
          />
          <Copy variant="small" style={{ color: colors.muted }}>
            Detta är ett lokalt demo. Inget konto skapas och inga meddelanden
            skickas till riktiga personer.
          </Copy>
        </View>
      )}
      {error ? (
        <Copy accessibilityRole="alert" style={{ color: colors.danger }}>
          {error}
        </Copy>
      ) : null}
      <Button
        title={step === 2 ? "Till Upptäck →" : "Fortsätt →"}
        loading={busy}
        onPress={() => void next()}
      />
      {step > 0 && (
        <Button
          title="Tillbaka"
          variant="ghost"
          disabled={busy}
          onPress={() => {
            setStep(step - 1);
            setError("");
          }}
        />
      )}
    </Screen>
  );
}
