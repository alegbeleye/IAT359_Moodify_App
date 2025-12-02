import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "./screens/dashboard";
import EntriesScreen from "./screens/entries";
import EntryDetailScreen from "./screens/entry-detail-screen";
import MoodSelect from "./screens/mood-select";
import CreateEntryScreen from "./screens/create-entry";
import { AuthProvider, useAuth } from "../context/auth-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import SignInScreen from "./screens/sign-in";
import SignUpScreen from "./screens/sign-up";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import ProfileScreen from "./screens/profile";
import locationService from "@/services/location";
import { useEffect, useState } from "react";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function TabIconWrapper({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      {children}
    </View>
  );
}

function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="screens/dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconWrapper focused={focused}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={20}
                color={
                  focused ? stylesColors.activeIcon : stylesColors.inactiveIcon
                }
              />
            </TabIconWrapper>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.labelText,
                focused && { color: stylesColors.activeLabel },
              ]}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Entries"
        component={EntriesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconWrapper focused={focused}>
              <MaterialCommunityIcons
                name={focused ? "book-open" : "book-outline"}
                size={20}
                color={
                  focused ? stylesColors.activeIcon : stylesColors.inactiveIcon
                }
              />
            </TabIconWrapper>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.labelText,
                focused && { color: stylesColors.activeLabel },
              ]}
            >
              Journal
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconWrapper focused={focused}>
              <MaterialCommunityIcons
                name={focused ? "account" : "account-outline"}
                size={20}
                color={
                  focused ? stylesColors.activeIcon : stylesColors.inactiveIcon
                }
              />
            </TabIconWrapper>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.labelText,
                focused && { color: stylesColors.activeLabel },
              ]}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const stylesColors = {
  activeBg: "#fde8ef",
  activeIcon: "#ff7f9a",
  inactiveIcon: "#9aa0a6",
  activeLabel: "#ffb6c2",
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.select({ ios: 72, android: 64 }),
    paddingBottom: Platform.select({ ios: 14, android: 8 }),
    paddingTop: 8,
    justifyContent: "center",
  },
  iconContainer: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: "",
  },
  labelText: {
    fontSize: 11,
    marginTop: 2,
    color: "#9aa0a6",
  },
  tabLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
});

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AppStack} />
      <Stack.Screen
        name="CreateEntry"
        component={CreateEntryScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="EntryDetail"
        component={EntryDetailScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="MoodSelect"
        component={MoodSelect}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  ) : (
    <AuthStack />
  );
}

function RootLayoutContent() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        await locationService.requestLocationPermission();
        setAppReady(true);
      } catch (error) {
        console.warn("Failed to init location:", error);
        setAppReady(true);
      }
    };

    initApp();
  }, []);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <RootNavigator />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
