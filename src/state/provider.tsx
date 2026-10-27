import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, View } from "react-native";
import { AppState } from "../data/models";
import { createSeed } from "../data/seed";
import { Action, reducer } from "./reducer";
import { loadState, saveState } from "./storage";
import { Button, Copy } from "../components/ui";
import { colors } from "../theme";

type ContextValue = {
  state: AppState;
  commit: (action: Action) => Promise<boolean>;
  busy: boolean;
  notice: string;
  notify: (message: string) => void;
};
const Context = createContext<ContextValue | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const current = useRef<AppState | null>(null);
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, notify] = useState("");
  const hydrate = async () => {
    setError("");
    try {
      const next = (await loadState()) ?? createSeed();
      current.current = next;
      setState(next);
    } catch {
      setError(
        "Det gick inte att läsa din lokala data. Försök igen, eller återställ demot.",
      );
    }
  };
  useEffect(() => {
    void hydrate();
  }, []);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => notify(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  async function commit(action: Action) {
    if (lock.current || !current.current) return false;
    lock.current = true;
    setBusy(true);
    try {
      const next = reducer(current.current, action);
      await saveState(next);
      current.current = next;
      setState(next);
      return true;
    } catch {
      notify("Kunde inte spara. Ditt utkast finns kvar – försök igen.");
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  if (!state)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          justifyContent: "center",
          padding: 28,
          gap: 20,
        }}
      >
        {error ? (
          <>
            <Copy>{error}</Copy>
            <Button title="Försök igen" onPress={() => void hydrate()} />
            <Button
              title="Återställ lokal demodata"
              variant="secondary"
              onPress={async () => {
                try {
                  const next = createSeed();
                  await saveState(next);
                  current.current = next;
                  setState(next);
                } catch {
                  setError(
                    "Återställningen misslyckades. Kontrollera att lokal lagring är tillåten.",
                  );
                }
              }}
            />
          </>
        ) : (
          <ActivityIndicator size="large" color={colors.primary} />
        )}
      </View>
    );
  return (
    <Context.Provider value={{ state, commit, busy, notice, notify }}>
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const value = useContext(Context);
  if (!value) throw new Error("StoreProvider saknas");
  return value;
}
