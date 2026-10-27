import { Screen } from "../components/ui";
import { ProfileDetail } from "../components/profile-detail";
import { useStore } from "../state/provider";
export default function Preview() {
  const { state } = useStore();
  return (
    <Screen>
      <ProfileDetail person={state.profile} />
    </Screen>
  );
}
