import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AREAS, Filters, SPORTS } from "../../data/models";
import { profiles } from "../../data/seed";
import { useStore } from "../../state/provider";
import { colors } from "../../theme";
import {
  Button,
  Chip,
  Copy,
  Empty,
  Field,
  SectionLabel,
} from "../../components/ui";
import { PersonCard } from "../../components/person-card";
import {
  defaultFilters,
  distance,
  findPeople,
  levelBounds,
} from "../../utils/people";

export default function Discover() {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [expanded, setExpanded] = useState(false);
  const [levelError, setLevelError] = useState("");
  const people = findPeople(profiles, state, filters);
  const origin = filters.area === "Alla" ? state.profile.area : filters.area;
  function setLevel(key: "min" | "max", value: string) {
    const next = { ...filters, [key]: value };
    if (next.sport !== "Alla") {
      const bounds = levelBounds(next.sport);
      const nums = [next.min, next.max]
        .filter((v) => v !== "")
        .map((v) => Number(v.replace(",", ".")));
      if (
        nums.some(
          (v) => !Number.isFinite(v) || v < bounds.min || v > bounds.max,
        ) ||
        (next.min !== "" &&
          next.max !== "" &&
          Number(next.min.replace(",", ".")) >
            Number(next.max.replace(",", ".")))
      ) {
        setLevelError(
          `Ange ${bounds.min}–${bounds.max}, med lägsta värdet först.`,
        );
        return;
      }
    }
    setLevelError("");
    setFilters(next);
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={people}
        keyExtractor={(p) => p.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 20,
          paddingTop: insets.top + 20,
          paddingBottom: 32,
          gap: 20,
          maxWidth: 640,
          width: "100%",
          alignSelf: "center",
        }}
        renderItem={({ item }) => (
          <PersonCard person={item} km={distance(origin, item.area)} />
        )}
        ListHeaderComponent={
          <View style={{ gap: 24 }}>
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
              <View
                style={{
                  backgroundColor: colors.sage,
                  padding: 10,
                  borderRadius: 24,
                }}
              >
                <Copy variant="small">{state.profile.area} ⌁</Copy>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              <SectionLabel>DITT NÄSTA GÄNG FINNS HÄR</SectionLabel>
              <Copy accessibilityRole="header" variant="hero">
                Hitta människor.{"\n"}Dela spelglädjen.
              </Copy>
              <Copy style={{ color: colors.muted }}>
                En ny sportkompis kan bli så mycket mer.
              </Copy>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              <Chip
                title="Alla sporter"
                selected={filters.sport === "Alla"}
                onPress={() => {
                  setFilters({ ...filters, sport: "Alla", min: "", max: "" });
                  setLevelError("");
                }}
              />
              {SPORTS.map((sport) => (
                <Chip
                  key={sport}
                  title={sport}
                  selected={filters.sport === sport}
                  onPress={() => {
                    setFilters({ ...filters, sport, min: "", max: "" });
                    setLevelError("");
                  }}
                />
              ))}
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Copy variant="small" style={{ flex: 1, color: colors.muted }}>
                {people.length} personer · inom {filters.distance} km
              </Copy>
              <Button
                title={expanded ? "Stäng filter −" : "Anpassa filter +"}
                variant="secondary"
                onPress={() => setExpanded(!expanded)}
              />
            </View>
            {expanded && (
              <View
                style={{
                  padding: 20,
                  borderRadius: 24,
                  backgroundColor: colors.paper,
                  gap: 16,
                  borderWidth: 1,
                  borderColor: colors.line,
                }}
              >
                <Copy variant="heading">Hitta ditt sällskap</Copy>
                <Copy variant="small">Sök runt ett område</Copy>
                <View
                  style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}
                >
                  <Chip
                    title={`Mitt område (${state.profile.area})`}
                    selected={filters.area === "Alla"}
                    onPress={() => setFilters({ ...filters, area: "Alla" })}
                  />
                  {AREAS.map((area) => (
                    <Chip
                      key={area}
                      title={area}
                      selected={filters.area === area}
                      onPress={() => setFilters({ ...filters, area })}
                    />
                  ))}
                </View>
                <Copy variant="small">Avstånd från {origin}</Copy>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {[5, 10, 25, 50].map((km) => (
                    <Chip
                      key={km}
                      title={`${km} km`}
                      selected={filters.distance === km}
                      onPress={() => setFilters({ ...filters, distance: km })}
                    />
                  ))}
                </View>
                {filters.sport !== "Alla" ? (
                  <>
                    <Copy variant="small">
                      {filters.sport === "Golf"
                        ? "Handicap (HCP)"
                        : filters.sport === "Löpning"
                          ? "Tempo i min/km, exempel 5,5 = 5:30"
                          : "Självskattad nivå 1–10"}{" "}
                      · frivilligt
                    </Copy>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <LevelField
                          label="Från"
                          value={filters.min}
                          filters={filters}
                          onApply={(value) => setLevel("min", value)}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <LevelField
                          label="Till"
                          value={filters.max}
                          filters={filters}
                          onApply={(value) => setLevel("max", value)}
                        />
                      </View>
                    </View>
                    {levelError ? (
                      <Copy
                        accessibilityRole="alert"
                        style={{ color: colors.danger }}
                      >
                        {levelError}
                      </Copy>
                    ) : null}
                    <Button
                      title="Ta bort nivåfilter"
                      variant="ghost"
                      onPress={() => {
                        setFilters({ ...filters, min: "", max: "" });
                        setLevelError("");
                      }}
                    />
                  </>
                ) : (
                  <Copy variant="small" style={{ color: colors.muted }}>
                    Välj en sport för att filtrera på nivå.
                  </Copy>
                )}
                <Copy variant="small" style={{ color: colors.muted }}>
                  Demoområden och ungefärliga avstånd. Ingen GPS används.
                </Copy>
                <Button
                  title="Återställ alla filter"
                  variant="ghost"
                  onPress={() => {
                    setFilters({ ...defaultFilters });
                    setLevelError("");
                  }}
                />
              </View>
            )}
            <View style={{ gap: 4 }}>
              <Copy variant="heading">Kanske din nästa sportkompis?</Copy>
              <Copy variant="small" style={{ color: colors.muted }}>
                Dina sportintressen och närhet prioriteras · fiktiva profiler
              </Copy>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Empty
            title="Lite för smalt sökfält?"
            body="Ditt nästa gäng kanske finns lite längre bort. Öka avståndet eller testa fler sporter."
            action={
              <Button
                title="Visa fler personer"
                onPress={() => {
                  setFilters({ ...defaultFilters });
                  setLevelError("");
                }}
              />
            }
          />
        }
      />
    </View>
  );
}

function LevelField({
  label,
  value,
  filters,
  onApply,
}: {
  label: string;
  value: string;
  filters: Filters;
  onApply: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value, filters]);
  return (
    <Field
      label={label}
      value={draft}
      onChangeText={setDraft}
      keyboardType="numbers-and-punctuation"
      onBlur={() => onApply(draft)}
      placeholder="Alla"
    />
  );
}
