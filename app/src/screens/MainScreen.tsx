import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as zod from "zod";
import CreateGameModal from "../components/models/createGameRoom";
import JoinGameModal from "../components/models/joinGameRoom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/auth-providers";
import { RootStackParamList } from "../types/navigateProps.types";

const { width } = Dimensions.get("window");

const MainScreen = () => {
  const [createGameVisible, setCreateGameVisible] = useState(false);
  const [createGameResponse, setCreateGameResponse] = useState<string | null>(
    null
  );
  const [joinGameVisible, setJoinGameVisible] = useState(false);
  const [howToPlayVisible, setHowToPlayVisible] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, isLoggedIn } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Staggered animations for better visual appeal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const menuItems: {
    id: number;
    icon: string;
    title: string;
    onPress: () => void;
    gradient: [string, string];
  }[] = [
    {
      id: 1,
      icon: "play",
      title: "CREATE GAME",
      onPress: () => {
        if (isLoggedIn) {
          setCreateGameVisible(true);
          handleCreateGame();
        } else {
          navigation.navigate("Login");
        }
      },
      gradient: ["#667eea", "#764ba2"],
    },
    {
      id: 2,
      icon: "people",
      title: "JOIN MULTIPLAYER",
      onPress: () => setJoinGameVisible(true),
      gradient: ["#4facfe", "#00f2fe"],
    },
    {
      id: 3,
      icon: "information-circle",
      title: "HOW TO PLAY",
      onPress: () => setHowToPlayVisible(true),
      gradient: ["#f093fb", "#f5576c"],
    },
    {
      id: 4,
      icon: "settings",
      title: "SETTINGS",
      onPress: () => navigation.navigate("Settings"),
      gradient: ["#43e97b", "#38f9d7"],
    },
  ];

  const handleProfilePress = () => {
    if (isLoggedIn) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Login");
    }
  };

  const handleIconPress = (icon: string) => {
    switch (icon) {
      case "settings":
        navigation.navigate("Settings");
        break;
      case "trophy":
        navigation.navigate("Leaderboard");
        break;
      default:
        break;
    }
  };

  const handleCreateGame = async () => {
    // Logic to create a new game can be added here
    console.log("Create Game button pressed");

    const { data, error } = await supabase
      .from("game_room")
      .insert([{ created_by: user?.id }])
      .select();

    if (error) {
      console.error("Error fetching game rooms:", error);
      return;
    } else {
      console.log("Fetched game rooms:", data);
      setCreateGameResponse(data ? JSON.stringify(data) : "No data");
    }
  };

  const handleJoinRoom = (data: { code: string }) => {
    // Handle join game logic here
    console.log("Joining game with code:", data.code);
    setJoinGameVisible(false);
  };

  return (
    <LinearGradient
      colors={["#131a29", "#1a2235", "#0f1420"]}
      style={styles.container}
    >
      {/* Header/Navbar */}
      <Animated.View
        style={[
          styles.navbar,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Pressable onPress={handleProfilePress} style={styles.profileButton}>
          <LinearGradient
            colors={
              isLoggedIn ? ["#667eea", "#764ba2"] : ["#4facfe", "#00f2fe"]
            }
            style={styles.profileGradient}
          >
            {isLoggedIn ? (
              <Image
                source={{
                  uri: user?.user_images || "https://github.com/shadcn.png",
                }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons name="person-circle" size={32} color="#fff" />
            )}
          </LinearGradient>
          {isLoggedIn && <View style={styles.onlineIndicator} />}
        </Pressable>

        <View style={styles.rightNav}>
          <TouchableOpacity
            onPress={() => handleIconPress("trophy")}
            style={styles.navIcon}
          >
            <LinearGradient
              colors={["#f093fb", "#f5576c"]}
              style={styles.iconGradient}
            >
              <Ionicons name="trophy" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleIconPress("settings")}
            style={styles.navIcon}
          >
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={styles.iconGradient}
            >
              <Ionicons name="settings" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView>
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.logoGradient}
        > */}
          <View style={styles.logoGradient}>
            <Image
              source={require("../../assets/guess-the-number-logo.png")}
              style={styles.logoImage}
            />
          </View>
          {/* </LinearGradient> */}
          <Text style={styles.logoTitle}>Guess The Number</Text>
          <Text style={styles.logoSubtitle}>Guessing Number Challenge</Text>
        </Animated.View>

        {/* Menu Buttons */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 20 + index * 10],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                onPress={item.onPress}
                style={styles.menuButton}
              >
                <LinearGradient
                  colors={item.gradient}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={item.icon as any} size={28} color="#fff" />
                  <Text style={styles.buttonText}>{item.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.footerText}>
            {isLoggedIn
              ? `Welcome back, ${user?.username || "Player"}!`
              : "Ready to play?"}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Modals */}

      <CreateGameModal
        visible={createGameVisible}
        onClose={() => setCreateGameVisible(false)}
        onStartGame={handleCreateGame}
      />
      <HowToPlayModal
        visible={howToPlayVisible}
        onClose={() => setHowToPlayVisible(false)}
      />
      <JoinGameModal
        visible={joinGameVisible}
        onClose={() => setJoinGameVisible(false)}
        onSubmit={handleJoinRoom}
      />
    </LinearGradient>
  );
};

export default MainScreen;

const joinGameSchema = zod.object({
  code: zod
    .string()
    .length(4, "Code must be exactly 4 characters")
    .regex(/^[A-Z0-9]+$/, "Code can only contain letters and numbers"),
});

const HowToPlayModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  if (!visible) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "#1a2235",
          borderRadius: 16,
          padding: 20,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          How to Play
        </Text>
        <Text style={{ color: "#ccc", fontSize: 16, marginBottom: 20 }}>
          1. Create or join a game. 2. Set your 4 digit number. 3. Take turns
          guessing the opponent's number. 4. Receive feedback on your guesses.
          5. First to guess correctly wins! 6. Have fun and challenge your
          friends!
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: "#667eea",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// const JoinGameModal = ({
//   visible,
//   onClose,
// }: {
//   visible: boolean;
//   onClose: () => void;
// }) => {
//   const { control, handleSubmit, formState, reset } = useForm({
//     resolver: zodResolver(joinGameSchema),
//     defaultValues: { code: "" },
//   });

//   const onSubmit = (data: { code: string }) => {
//     // Handle join game logic here
//     console.log("Joining game with code:", data.code);
//     reset();
//     onClose();
//   };
//   if (!visible) return null;
//   return (
//     <View
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 20,
//         zIndex: 10,
//       }}
//     >
//       <View
//         style={{
//           backgroundColor: "#1a2235",
//           borderRadius: 16,
//           padding: 20,
//           width: "100%",
//           maxWidth: 400,
//         }}
//       >
//         <Text
//           style={{
//             color: "#fff",
//             fontSize: 20,
//             fontWeight: "bold",
//             marginBottom: 10,
//             textAlign: "center",
//           }}
//         >
//           Join Multiplayer Game
//         </Text>
//         <Text style={{ color: "#ccc", fontSize: 16, flex: 1 }}>
//           Enter the 4-character game code provided by room creator:
//         </Text>
//         <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
//           <Controller
//             control={control}
//             name="code"
//             render={({ field }) => (
//               <TextInput
//                 style={{
//                   backgroundColor: "#232b3e",
//                   color: "#fff",
//                   borderRadius: 8,
//                   padding: 12,
//                   fontSize: 20,
//                   letterSpacing: 8,
//                   textAlign: "center",
//                   marginBottom: 10,
//                   width: "100%",
//                 }}
//                 placeholder="AB12"
//                 placeholderTextColor="#9ca3af"
//                 value={field.value}
//                 onChangeText={field.onChange}
//                 onBlur={field.onBlur}
//                 autoFocus
//                 maxLength={4}
//                 autoCapitalize="characters"
//                 keyboardType="default"
//               />
//             )}
//           />
//         </View>
//         <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//           <TouchableOpacity
//             onPress={handleSubmit(onSubmit)}
//             style={{
//               backgroundColor: "#4facfe",
//               padding: 12,
//               width: "48%",
//               borderRadius: 8,
//               alignItems: "center",
//               marginTop: 10,
//               marginBottom: 10,
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.3,
//               shadowRadius: 8,
//               elevation: 8,
//             }}
//           >
//             <Text style={{ color: "#fff", fontWeight: "bold" }}>Join</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={onClose}
//             style={{
//               backgroundColor: "#667eea",
//               padding: 12,
//               width: "48%",
//               borderRadius: 8,
//               alignItems: "center",
//               marginTop: 10,
//               marginBottom: 10,
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.3,
//               shadowRadius: 8,
//               elevation: 8,
//             }}
//           >
//             <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    justifyContent: "space-between",
    backgroundColor: "#0f1420",
    position: "relative",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  profileButton: {
    position: "relative",
  },
  profileGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4caf50",
    borderWidth: 2,
    borderColor: "#131a29",
  },
  rightNav: {
    flexDirection: "row",
    gap: 12,
  },
  navIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  logoSubtitle: {
    color: "#a0a0a0",
    fontSize: 16,
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  menuButton: {
    width: width - 40,
    height: 80,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
});
