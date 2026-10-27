export const SPORTS = ["Golf", "Tennis", "Padel", "Löpning", "Squash"] as const;
export type Sport = (typeof SPORTS)[number];
export type Levels = Partial<Record<Sport, number>>;
export const AREAS = [
  "Södermalm",
  "Vasastan",
  "Kungsholmen",
  "Östermalm",
  "Nacka",
  "Solna",
  "Bromma",
  "Täby",
  "Huddinge",
  "Lidingö",
] as const;
export type Area = (typeof AREAS)[number];
export const PROMPTS = [
  "Min perfekta söndag…",
  "Jag söker någon att…",
  "Sporten jag aldrig tröttnar på…",
  "Det här gör mig till en bra träningskompis…",
];
export type Profile = {
  id: string;
  name: string;
  age: number;
  area: Area;
  photo: string;
  bio: string;
  sports: Levels;
  interests: string[];
  answers: Record<string, string>;
};
export type Relation = "friend" | "incoming" | "outgoing";
export type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
};
export type AppState = {
  version: 1;
  loggedIn: boolean;
  onboarded: boolean;
  profile: Profile;
  relations: Record<string, Relation>;
  conversations: Record<string, Message[]>;
  blocked: string[];
  readAt: Record<string, string>;
};
export type Filters = {
  sport: Sport | "Alla";
  area: Area | "Alla";
  distance: number;
  min: string;
  max: string;
};
