import { useState } from "react";
import { View } from "react-native";
import { Host, Slider } from "@expo/ui";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { AREAS, Area, Profile, PROMPTS, SPORTS, Sport } from "../data/models";
import { levelBounds, levelLabel } from "../utils/people";
import { colors } from "../theme";
import { Button, Chip, Copy, Field, SectionLabel } from "./ui";
import { Portrait } from "./portrait";

export function BasicsForm({
  draft,
  onChange,
}: {
  draft: Profile;
  onChange: (p: Profile) => void;
}) {
  const [photoError, setPhotoError] = useState("");
  const [picking, setPicking] = useState(false);
  async function pickPhoto() {
    setPhotoError("");
    setPicking(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        base64: process.env.EXPO_OS === "web",
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      let uri = asset.uri;
      if (process.env.EXPO_OS === "web" && asset.base64)
        uri = `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`;
      else if (process.env.EXPO_OS !== "web") {
        const extension = asset.uri.split(".").pop()?.split("?")[0] || "jpg";
        const saved = new File(
          Paths.document,
          `profile-${Date.now()}.${extension}`,
        );
        new File(asset.uri).copy(saved);
        uri = saved.uri;
      }
      onChange({ ...draft, photo: uri });
    } catch {
      setPhotoError(
        "Kunde inte öppna bilden. Kontrollera bildbehörigheter eller välj en demobild.",
      );
    } finally {
      setPicking(false);
    }
  }
  return (
    <View style={{ gap: 24 }}>
      <View style={{ alignItems: "center", gap: 12 }}>
        <Portrait
          name={draft.name}
          photo={draft.photo}
          style={{ width: 132, height: 132, borderRadius: 48 }}
        />
        <Button
          title="Välj från bildbibliotek"
          variant="secondary"
          loading={picking}
          onPress={() => void pickPhoto()}
        />
        <Copy variant="small" style={{ color: colors.muted }}>
          Eller välj en demobild
        </Copy>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["portrait-23", "portrait-1", "portrait-3"].map((photo, index) => (
            <Chip
              key={photo}
              title={`Bild ${index + 1}`}
              selected={draft.photo === photo}
              onPress={() => onChange({ ...draft, photo })}
            />
          ))}
        </View>
        {photoError ? (
          <Copy accessibilityRole="alert" style={{ color: colors.danger }}>
            {photoError}
          </Copy>
        ) : null}
      </View>
      <Field
        label="Vad heter du?"
        value={draft.name}
        onChangeText={(name) => onChange({ ...draft, name })}
        maxLength={60}
        autoComplete="name"
        placeholder="Ditt namn"
      />
      <Field
        label="Ålder"
        value={draft.age ? String(draft.age) : ""}
        onChangeText={(value) =>
          onChange({ ...draft, age: Number(value.replace(/[^0-9]/g, "")) })
        }
        keyboardType="number-pad"
        maxLength={3}
        placeholder="18–100 år"
      />
      <Copy style={{ fontWeight: "600" }}>Var vill du hitta ditt gäng?</Copy>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {AREAS.map((area) => (
          <Chip
            key={area}
            title={area}
            selected={draft.area === area}
            onPress={() => onChange({ ...draft, area: area as Area })}
          />
        ))}
      </View>
    </View>
  );
}
export function SportsForm({
  draft,
  onChange,
}: {
  draft: Profile;
  onChange: (p: Profile) => void;
}) {
  function toggle(sport: Sport) {
    const sports = { ...draft.sports };
    if (sports[sport] !== undefined) delete sports[sport];
    else sports[sport] = sport === "Golf" ? 28 : sport === "Löpning" ? 6 : 4;
    onChange({ ...draft, sports });
  }
  return (
    <View style={{ gap: 24 }}>
      <View style={{ gap: 8, flexDirection: "row", flexWrap: "wrap" }}>
        {SPORTS.map((sport) => (
          <Chip
            key={sport}
            title={sport}
            selected={draft.sports[sport] !== undefined}
            onPress={() => toggle(sport)}
          />
        ))}
      </View>
      {Object.entries(draft.sports).map(([s, value]) => {
        const sport = s as Sport;
        return (
          <View
            key={sport}
            style={{
              backgroundColor: colors.paper,
              borderRadius: 20,
              padding: 20,
              gap: 12,
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Copy variant="heading">{sport}</Copy>
            <Copy>{levelLabel(sport, value!)}</Copy>
            <Host matchContents colorScheme="light" seedColor={colors.green}>
              <Slider
                value={value!}
                {...levelBounds(sport)}
                onValueChange={(level) =>
                  onChange({
                    ...draft,
                    sports: {
                      ...draft.sports,
                      [sport]: Math.round(level * 100) / 100,
                    },
                  })
                }
                testID={`level-${sport}`}
              />
            </Host>
            <Copy variant="small" style={{ color: colors.muted }}>
              {sport === "Golf"
                ? "Ange ditt handicap, −10 till 54."
                : sport === "Löpning"
                  ? "Ditt bekväma tempo, 3:00–10:00 min/km."
                  : "Självskattad nivå 1–10. 1 = nybörjare, 10 = mycket erfaren. Ingen officiell ranking."}
            </Copy>
          </View>
        );
      })}
    </View>
  );
}
export function PersonalForm({
  draft,
  onChange,
}: {
  draft: Profile;
  onChange: (p: Profile) => void;
}) {
  const interests = [
    "Kaffe",
    "Natur",
    "Musik",
    "Matlagning",
    "Resor",
    "Böcker",
    "Bad",
    "Film",
    "Konst",
  ];
  return (
    <View style={{ gap: 24 }}>
      <Field
        label="Några ord om dig (frivilligt)"
        value={draft.bio}
        onChangeText={(bio) => onChange({ ...draft, bio })}
        multiline
        maxLength={350}
        placeholder="Vad gör en match med dig lite roligare?"
      />
      <SectionLabel>ÄVEN UTANFÖR BANAN</SectionLabel>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {[...new Set([...interests, ...draft.interests])].map((interest) => (
          <Chip
            key={interest}
            title={interest}
            selected={draft.interests.includes(interest)}
            onPress={() =>
              onChange({
                ...draft,
                interests: draft.interests.includes(interest)
                  ? draft.interests.filter((i) => i !== interest)
                  : [...draft.interests, interest],
              })
            }
          />
        ))}
      </View>
      <Copy variant="heading">Lite mer personlighet</Copy>
      <Copy style={{ color: colors.muted }}>
        Helt frivilligt. Ett kort svar räcker.
      </Copy>
      {PROMPTS.map((prompt) => (
        <Field
          key={prompt}
          label={prompt}
          value={draft.answers[prompt] ?? ""}
          onChangeText={(answer) =>
            onChange({
              ...draft,
              answers: { ...draft.answers, [prompt]: answer },
            })
          }
          maxLength={200}
          multiline
          placeholder="Ditt svar…"
        />
      ))}
    </View>
  );
}
