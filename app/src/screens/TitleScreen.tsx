import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

export default function TitleScreen({ navigation }: any) {
  const moveAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;

  const startAnimations = () => {
    // Button bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnimation, {
          toValue: 8,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(moveAnimation, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in and scale up content
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startAnimations();
  }, []);

  return (
    <View style={styles.safeArea}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../assets/game-background.jpg")}
      >
        {/* <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        /> */}

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnimation,
              transform: [{ scale: scaleAnimation }],
            },
          ]}
        >
          <Image
            source={require("../../assets/guess-the-number.png")}
            style={styles.logo}
          />

          <Text style={styles.tagline}>The Ultimate Number Challenge</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace("MainTabs", { screen: "Home" })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#f9a825", "#ffc107", "#f9a825"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Animated.View
                style={{ transform: [{ translateX: moveAnimation }] }}
              >
                <Ionicons name="play" size={32} color="#fff" />
              </Animated.View>
              <Text style={styles.buttonText}>Start Game</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.subText}>
            Can you crack the vault's secret number?
          </Text>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Test your intuition and logic skills
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.85,
    height: 180,
    resizeMode: "contain",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  tagline: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    overflow: "hidden",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subText: {
    marginTop: 40,
    color: "#f5f5f5",
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  footer: {
    position: "absolute",
    bottom: 40,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
});
