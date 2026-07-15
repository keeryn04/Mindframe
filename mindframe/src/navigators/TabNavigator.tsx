import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen }    from "../screens/HomeScreen";
import { StatsScreen }   from "../screens/StatsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { ROUTES }        from "./routes";
import { colors } from "../styling/theme";
import { tabBarStyle } from "../styling/TabNavigator.styles";

export type TabParamList = {
  [ROUTES.HOME]:    undefined;
  [ROUTES.STATS]:   undefined;
  [ROUTES.PROFILE]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<keyof TabParamList, { focused: IoniconName; default: IoniconName }> = {
  [ROUTES.HOME]:    { focused: "home",          default: "home-outline" },
  [ROUTES.STATS]:   { focused: "bar-chart",      default: "bar-chart-outline" },
  [ROUTES.PROFILE]: { focused: "person",         default: "person-outline" },
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList];
          const name  = focused ? icons.focused : icons.default;
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={ROUTES.STATS}   component={StatsScreen} />
      <Tab.Screen name={ROUTES.HOME}    component={HomeScreen} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
}