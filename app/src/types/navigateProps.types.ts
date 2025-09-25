import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Leaderboard: undefined;
  Game: { gameId: string }; // Example of a route with params

  // Add other routes here if needed
};

export type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login",
  "Signup"
>;
