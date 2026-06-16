import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { ROUTES } from "./routes";
import { useUserStateStore } from "../store/useUserStateStore";
import { Ionicons } from "@expo/vector-icons";

export type TabParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.TASKS]: undefined;
  [ROUTES.STATS]: undefined;
  [ROUTES.SETTINGS]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<keyof TabParamList, { focused: IoniconName; default: IoniconName }> = {
  [ROUTES.HOME]:     { focused: "home",          default: "home-outline" },
  [ROUTES.TASKS]:    { focused: "checkmark-done", default: "checkmark-done-outline" },
  [ROUTES.STATS]:    { focused: "bar-chart",      default: "bar-chart-outline" },
  [ROUTES.SETTINGS]: { focused: "settings",       default: "settings-outline" },
};

export function TabNavigator() {
  const recommendations = useUserStateStore((s) => s.recommendations);
  const urgentCount = recommendations.filter((r) => r.priority === "urgent").length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList];
          const name = focused ? icons.focused : icons.default;
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarBadge: urgentCount > 0 ? urgentCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}