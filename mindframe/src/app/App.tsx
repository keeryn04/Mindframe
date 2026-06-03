import { RootNavigator } from "../navigators/RootNavigator";
import { AppProviders } from "./AppProviders";

export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}