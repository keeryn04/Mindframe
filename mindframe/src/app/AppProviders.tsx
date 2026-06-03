import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

interface Props {
  children: React.ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {children}
    </NavigationContainer>
  );
}