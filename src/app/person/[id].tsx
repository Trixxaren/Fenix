import { confirmAction } from "../../utils/confirm";
import { router, useLocalSearchParams } from "expo-router";
import { profiles } from "../../data/seed";
import { useStore } from "../../state/provider";
import { Button, Copy, Empty, Screen } from "../../components/ui";
import { ProfileDetail } from "../../components/profile-detail";
import { colors } from "../../theme";

export default function Person() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, commit, busy, notify } = useStore();
  const person = profiles.find((p) => p.id === id);
  if (!person)
    return (
      <Screen>
        <Empty
          title="Profilen finns inte"
          body="Gå tillbaka och välj en person från Upptäck."
        />
      </Screen>
    );
  const blocked = state.blocked.includes(id);
  const relation = state.relations[id];
  async function update(value?: "friend" | "outgoing") {
    if (await commit({ type: "relation", id, value }))
      notify(
        value === "friend"
          ? "Ni är nu vänner i demot!"
          : value === "outgoing"
            ? "Vänförfrågan sparad i demot."
            : "Vänrelationen har uppdaterats.",
      );
  }
  return (
    <Screen>
      <ProfileDetail person={person} />
      {blocked ? (
        <Copy style={{ color: colors.danger }}>
          Den här profilen är blockerad i ditt demo. Återställ demodata under
          Profil för att häva blockeringen.
        </Copy>
      ) : (
        <>
          <Button
            title={`Säg hej till ${person.name.split(" ")[0]} →`}
            onPress={() =>
              router.push({ pathname: "/conversation/[id]", params: { id } })
            }
          />
          <Button
            title={
              relation === "friend"
                ? "Ta bort vän"
                : relation === "outgoing"
                  ? "Förfrågan väntar · Ångra"
                  : relation === "incoming"
                    ? "Acceptera vänförfrågan"
                    : "Lägg till vän"
            }
            variant="secondary"
            disabled={busy}
            onPress={() => {
              if (relation === "friend")
                confirmAction(
                  "Ta bort vän?",
                  `Vill du ta bort ${person.name.split(" ")[0]} från dina vänner?`,
                  "Ta bort",
                  () => void update(),
                );
              else
                void update(
                  relation === "outgoing"
                    ? undefined
                    : relation === "incoming"
                      ? "friend"
                      : "outgoing",
                );
            }}
          />
          {relation === "incoming" && (
            <Button
              title="Avböj förfrågan"
              variant="ghost"
              disabled={busy}
              onPress={() => void update()}
            />
          )}
          <Button
            title="Blockera i demot"
            variant="ghost"
            disabled={busy}
            onPress={() =>
              confirmAction(
                "Blockera profil?",
                "Profilen döljs i Upptäck och kan inte kontaktas i demot. Gamla konversationer sparas men döljs.",
                "Blockera",
                async () => {
                  if (await commit({ type: "block", id })) {
                    notify("Profilen är blockerad.");
                    router.back();
                  }
                },
              )
            }
          />
        </>
      )}
      <Copy
        variant="small"
        style={{ color: colors.muted, textAlign: "center" }}
      >
        Fiktiv profil. All kontakt simuleras på din enhet.
      </Copy>
    </Screen>
  );
}
