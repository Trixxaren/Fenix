import { AppState, Area, Filters, Profile, Sport } from "../data/models";

// Fixed demo coordinates (km), not GPS. Distances are relative to the selected area.
const points: Record<Area, [number, number]> = {
  Södermalm: [0, 0],
  Vasastan: [0, 5],
  Kungsholmen: [-3, 3],
  Östermalm: [3, 5],
  Nacka: [8, -2],
  Solna: [-4, 8],
  Bromma: [-9, 6],
  Täby: [4, 20],
  Huddinge: [-5, -14],
  Lidingö: [10, 8],
};
export function distance(from: Area, to: Area) {
  return Math.round(
    Math.hypot(
      points[from][0] - points[to][0],
      points[from][1] - points[to][1],
    ),
  );
}
export const defaultFilters: Filters = {
  sport: "Alla",
  area: "Alla",
  distance: 25,
  min: "",
  max: "",
};
export function findPeople(
  people: Profile[],
  state: AppState,
  filters: Filters,
) {
  const origin = filters.area === "Alla" ? state.profile.area : filters.area;
  return people
    .filter((p) => {
      if (
        state.blocked.includes(p.id) ||
        distance(origin, p.area) > filters.distance
      )
        return false;
      if (filters.sport === "Alla") return true;
      const level = p.sports[filters.sport];
      return (
        level !== undefined &&
        (filters.min === "" ||
          level >= Number(filters.min.replace(",", "."))) &&
        (filters.max === "" || level <= Number(filters.max.replace(",", ".")))
      );
    })
    .sort((a, b) => {
      const shared = (p: Profile) =>
        Object.keys(p.sports).filter(
          (s) => state.profile.sports[s as Sport] !== undefined,
        ).length;
      return (
        shared(b) - shared(a) ||
        distance(origin, a.area) - distance(origin, b.area)
      );
    });
}
export function levelLabel(sport: Sport, level: number) {
  if (sport === "Golf") return `HCP ${level.toLocaleString("sv-SE")}`;
  if (sport === "Löpning") {
    const seconds = Math.round(level * 60);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} min/km`;
  }
  return `${level}/10 · självskattad`;
}
export function levelBounds(sport: Sport) {
  return sport === "Golf"
    ? { min: -10, max: 54, step: 1 }
    : sport === "Löpning"
      ? { min: 3, max: 10, step: 0.25 }
      : { min: 1, max: 10, step: 1 };
}
export function validateProfile(p: Profile): string | null {
  if (p.name.trim().length < 2) return "Skriv ett namn med minst två tecken.";
  if (!Number.isInteger(p.age) || p.age < 18 || p.age > 100)
    return "Ange en ålder mellan 18 och 100 år.";
  if (!p.photo) return "Välj en profilbild eller en demobild.";
  if (!points[p.area]) return "Välj ett område.";
  if (!Object.keys(p.sports).length) return "Välj minst en sport.";
  for (const [s, value] of Object.entries(p.sports)) {
    const bounds = levelBounds(s as Sport);
    if (!Number.isFinite(value) || value < bounds.min || value > bounds.max)
      return `Kontrollera din nivå för ${s}.`;
  }
  return null;
}
