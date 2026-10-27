import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Profile } from "../data/models";
import { colors } from "../theme";
import { Copy } from "./ui";
import { Portrait } from "./portrait";
export function PersonRow({
  person,
  subtitle,
}: {
  person: Profile;
  subtitle?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Visa ${person.name}`}
      onPress={() =>
        router.push({ pathname: "/person/[id]", params: { id: person.id } })
      }
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        minHeight: 80,
        paddingVertical: 12,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Portrait
        name={person.name}
        photo={person.photo}
        style={{ width: 64, height: 64, borderRadius: 24 }}
      />
      <View style={{ flex: 1, gap: 4 }}>
        <Copy style={{ fontWeight: "700" }}>{person.name}</Copy>
        <Copy variant="small" style={{ color: colors.muted }}>
          {subtitle ??
            `${person.area} · ${Object.keys(person.sports).join(", ")}`}
        </Copy>
      </View>
      <Copy style={{ color: colors.muted }}>↗</Copy>
    </Pressable>
  );
}
