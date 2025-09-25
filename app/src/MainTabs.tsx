import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";
import Games from "./screens/Games";
import MainScreen from "./screens/MainScreen";
import Profile from "./screens/Profile";
import Stats from "./screens/Stats";
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1f2937",
          borderTopColor: "#1f2937",
          height: 65,
          paddingBottom: 8,
          position: "absolute",
          bottom: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Game") {
            iconName = focused ? "game-controller" : "game-controller-outline";
          } else if (route.name === "Stats") {
            iconName = focused ? "trending-up" : "trending-up-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <Ionicons name={iconName as string} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Game"
        component={Games}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs;
