import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import MainTabs from "./MainTabs";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import TitleScreen from "./screens/TitleScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <>
      <StatusBar
        style="light"
        hidden={false}
        backgroundColor="transparent"
        translucent
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Title" component={TitleScreen} />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </>
  );
}
