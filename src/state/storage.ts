import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "../data/models";
import { validateProfile } from "../utils/people";
export const STORAGE_KEY = "fenix.local.v1";
export async function loadState(): Promise<AppState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const s = JSON.parse(raw);
  if (
    s.version !== 1 ||
    !s.profile ||
    validateProfile(s.profile) ||
    typeof s.loggedIn !== "boolean" ||
    typeof s.onboarded !== "boolean" ||
    !s.relations ||
    !s.conversations ||
    !Array.isArray(s.blocked) ||
    !s.readAt
  )
    throw new Error("Sparad demodata kan inte läsas.");
  return s as AppState;
}
export async function saveState(state: AppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
