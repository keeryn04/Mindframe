import { ErrorBoundary } from "../components/ErrorBoundary";
import { RootNavigator } from "../navigators/RootNavigator";
import { AppProviders } from "./AppProviders";

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </ErrorBoundary>
  );
}