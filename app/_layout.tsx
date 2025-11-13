import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "./screens/dashboard";
import EntriesScreen from "./screens/entries";
import PlaylistScreen from "./screens/playlist";
import EntryDetailScreen from "./screens/entry-detail-screen";
import MoodSelect from "./screens/mood-select";
import { AuthProvider, useAuth } from "../context/auth-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import SignInScreen from "./screens/sign-in";
import SignUpScreen from "./screens/sign-up";
import { View, Text, Platform, StyleSheet } from "react-native";
import ProfileScreen from "./screens/profile";

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
        name="Dashboard"
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

/* colors separated for easy tweaking */
const stylesColors = {
  activeBg: "#fde8ef", // soft pink behind active icon
  activeIcon: "#ff7f9a", // active icon color
  inactiveIcon: "#9aa0a6", // greyed icon color
  activeLabel: "#ffb6c2", // light pink label color
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
      <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
      <Stack.Screen name="MoodSelect" component={MoodSelect} />
      <Stack.Screen name="Playlist" component={PlaylistScreen} />
    </Stack.Navigator>
  ) : (
    <AuthStack />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
