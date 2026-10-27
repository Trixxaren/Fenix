import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Profile, Sport } from "../data/models";
import { levelLabel } from "../utils/people";
import { colors, radius } from "../theme";
import { Copy } from "./ui";
import { Portrait } from "./portrait";

export const sportMark: Record<Sport, string> = {
  Golf: "⚑",
  Tennis: "◉",
  Padel: "◈",
  Löpning: "↗",
  Squash: "◎",
};
const sportColors: Record<Sport, string> = {
  Golf: colors.sage,
  Tennis: colors.yellow,
  Padel: colors.lilac,
  Löpning: colors.soft,
  Squash: colors.sage,
};
export function SportTags({
  person,
  detailed = false,
}: {
  person: Profile;
  detailed?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      {Object.entries(person.sports).map(([sport, level]) => (
        <View
          key={sport}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: sportColors[sport as Sport],
            borderRadius: radius.sm,
            gap: 4,
          }}
        >
          <Copy variant="small" style={{ fontWeight: "600" }}>
            {sportMark[sport as Sport]} {sport}
          </Copy>
          {detailed && (
            <Copy variant="small">{levelLabel(sport as Sport, level!)}</Copy>
          )}
        </View>
      ))}
    </View>
  );
}
export function PersonCard({ person, km }: { person: Profile; km: number }) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/person/[id]", params: { id: person.id } })
      }
      accessibilityRole="button"
      accessibilityLabel={`Visa ${person.name}s profil`}
      style={({ pressed }) => ({
        backgroundColor: colors.paper,
        borderRadius: radius.lg,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.line,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View>
        <Portrait
          photo={person.photo}
          name={person.name}
          style={{ width: "100%", aspectRatio: 1.12 }}
        />
        <View
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: colors.paper,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: radius.full,
          }}
        >
          <Copy
            variant="small"
            style={{ color: colors.green, fontWeight: "700" }}
          >
            Öppen för nya sportkompisar
          </Copy>
        </View>
      </View>
      <View style={{ padding: 20, gap: 14 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Copy variant="title">
              {person.name.split(" ")[0]}, {person.age}
            </Copy>
            <Copy variant="small" style={{ color: colors.muted }}>
              {person.area} · ca {km} km
            </Copy>
          </View>
          <View
            style={{
              backgroundColor: colors.soft,
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Copy variant="heading" style={{ color: colors.primary }}>
              ↗
            </Copy>
          </View>
        </View>
        <SportTags person={person} detailed />
        <Copy numberOfLines={3} style={{ color: colors.muted }}>
          {person.bio}
        </Copy>
      </View>
    </Pressable>
  );
}
