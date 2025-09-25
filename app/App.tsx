import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "react-native-toast-notifications";
import RootNavigator from "./src/index";
import AuthProvider from "./src/providers/auth-providers";
import QueryProvider from "./src/providers/query-provider";

export default function App() {
  return (
    <ToastProvider
      placement="top"
      offsetTop={50}
      offsetBottom={40}
      duration={3000}
      animationType="slide-in"
      successColor="#4BB543"
      dangerColor="#FF3333"
      warningColor="#FFCC00"
      normalColor="#333333"
      textStyle={{ color: "white", fontSize: 16 }}
      style={{ zIndex: 9999 }}
    >
      <NavigationContainer>
        <QueryProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </QueryProvider>
      </NavigationContainer>
    </ToastProvider>
  );
}
