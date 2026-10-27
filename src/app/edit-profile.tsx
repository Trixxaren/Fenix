import { useState } from "react";
import { router } from "expo-router";
import {
  BasicsForm,
  PersonalForm,
  SportsForm,
} from "../components/profile-form";
import { Button, Copy, Screen, SectionLabel } from "../components/ui";
import { useStore } from "../state/provider";
import { validateProfile } from "../utils/people";
import { colors } from "../theme";
export default function EditProfile() {
  const { state, commit, busy, notify } = useStore();
  const [draft, setDraft] = useState(state.profile);
  const [error, setError] = useState("");
  async function save() {
    const issue = validateProfile(draft);
    if (issue) {
      setError(issue);
      return;
    }
    if (
      await commit({
        type: "profile",
        profile: { ...draft, name: draft.name.trim() },
      })
    ) {
      notify("Din profil är sparad på den här enheten.");
      router.back();
    }
  }
  return (
    <Screen>
      <Copy variant="title">Gör profilen till din.</Copy>
      <SectionLabel>GRUNDERNA</SectionLabel>
      <BasicsForm draft={draft} onChange={setDraft} />
      <SectionLabel>DINA SPORTER</SectionLabel>
      <SportsForm draft={draft} onChange={setDraft} />
      <PersonalForm draft={draft} onChange={setDraft} />
      {error ? (
        <Copy accessibilityRole="alert" style={{ color: colors.danger }}>
          {error}
        </Copy>
      ) : null}
      <Button
        title="Spara ändringar"
        loading={busy}
        onPress={() => void save()}
      />
      <Button
        title="Avbryt"
        variant="ghost"
        onPress={() => router.back()}
        disabled={busy}
      />
    </Screen>
  );
}
