import { View } from "react-native";
import { Profile } from "../data/models";
import { colors } from "../theme";
import { Copy, SectionLabel } from "./ui";
import { Portrait } from "./portrait";
import { SportTags } from "./person-card";
export function ProfileDetail({ person }: { person: Profile }) {
  return (
    <View style={{ gap: 24 }}>
      <Portrait
        photo={person.photo}
        name={person.name}
        style={{ width: "100%", aspectRatio: 0.9, borderRadius: 28 }}
      />
      <View style={{ gap: 6 }}>
        <Copy variant="hero">
          {person.name.split(" ")[0]}, {person.age}
        </Copy>
        <Copy style={{ color: colors.muted }}>
          {person.name} · {person.area}
        </Copy>
      </View>
      <Copy>
        {person.bio ||
          "Det bästa sättet att lära känna mig? Säg hej och föreslå en match!"}
      </Copy>
      <SectionLabel>SES VI PÅ BANAN?</SectionLabel>
      <SportTags person={person} detailed />
      {person.interests.length > 0 && (
        <>
          <SectionLabel>ÄVEN UTANFÖR BANAN</SectionLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {person.interests.map((i) => (
              <View
                key={i}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.line,
                  borderRadius: 24,
                }}
              >
                <Copy variant="small">{i}</Copy>
              </View>
            ))}
          </View>
        </>
      )}
      {Object.entries(person.answers)
        .filter(([, answer]) => answer.trim())
        .map(([question, answer], i) => (
          <View
            key={question}
            style={{
              padding: 24,
              borderRadius: 24,
              gap: 12,
              backgroundColor: i % 2 ? colors.lilac : colors.sage,
            }}
          >
            <SectionLabel>{question}</SectionLabel>
            <Copy variant="heading" style={{ lineHeight: 30 }}>
              {answer}
            </Copy>
          </View>
        ))}
    </View>
  );
}
