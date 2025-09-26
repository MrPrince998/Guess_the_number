import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Pressable,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";

const { width } = Dimensions.get("window");

const CreateGameModal = ({
  visible,
  onClose,
  onStartGame,
}: {
  visible: boolean;
  onClose: () => void;
  onStartGame?: () => void;
}) => {
  const [roomCode] = useState("AC12");
  const [players] = useState([
    { id: 1, name: "You", avatar: null, isHost: true, isReady: true },
    {
      id: 2,
      name: "Waiting for player...",
      avatar: null,
      isHost: false,
      isReady: false,
    },
  ]);
  const [isCopied, setIsCopied] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleStartGame = () => {
    console.log("Start Game button pressed");
    onStartGame?.();
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(roomCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      Alert.alert("Error", "Failed to copy room code");
    }
  };

  const handleLeaveRoom = () => {
    Alert.alert(
      "Leave Room",
      "Are you sure you want to leave this game room?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", style: "destructive", onPress: onClose },
      ]
    );
  };

  if (!visible) return null;

  const connectedPlayers = players.filter((player) => player.isReady);
  const canStartGame = connectedPlayers.length >= 1;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 1000,
        opacity: fadeAnim,
      }}
    >
      <Animated.View
        style={{
          width: "100%",
          maxWidth: 400,
          transform: [
            {
              scale: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: fadeAnim,
        }}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={{
            borderRadius: 24,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Header Section */}
          <View
            style={{ alignItems: "center", padding: 30, paddingBottom: 20 }}
          >
            <LinearGradient
              colors={["#ffffff20", "#ffffff10"]}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Ionicons name="game-controller" size={48} color="#fff" />
            </LinearGradient>
            <Text
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Game Room
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Share the code below to invite friends
            </Text>
          </View>

          {/* Content Section */}
          <View style={{ backgroundColor: "#1a2235", padding: 24 }}>
            {/* Room Code Section */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 12,
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Room Code
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{
                    backgroundColor: "#232b3e",
                    color: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 24,
                    letterSpacing: 8,
                    textAlign: "center",
                    fontWeight: "bold",
                    borderWidth: 2,
                    borderColor: "#667eea",
                  }}
                  value={roomCode}
                  editable={false}
                  selectTextOnFocus={false}
                />
                <View
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="key" size={20} color="#667eea" />
                </View>
              </View>

              <Pressable
                onPress={copyToClipboard}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <LinearGradient
                  colors={
                    isCopied ? ["#4caf50", "#45a049"] : ["#4facfe", "#00f2fe"]
                  }
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    alignItems: "center",
                    marginTop: 12,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <Ionicons
                    name={isCopied ? "checkmark" : "copy"}
                    size={18}
                    color="#fff"
                  />
                  <Text
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                  >
                    {isCopied ? "Copied!" : "Copy Code"}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.1)",
                marginVertical: 16,
              }}
            />

            {/* Players Section */}
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}
                >
                  Players
                </Text>
                <Text style={{ color: "#ccc", fontSize: 14 }}>
                  {connectedPlayers.length}/2
                </Text>
              </View>

              <View style={{ gap: 12 }}>
                {players.map((player, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#232b3e",
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: player.isReady ? "#667eea" : "transparent",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        flex: 1,
                      }}
                    >
                      <LinearGradient
                        colors={
                          player.isReady
                            ? ["#667eea", "#764ba2"]
                            : ["#666", "#444"]
                        }
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {player.avatar ? (
                          <Image
                            source={{ uri: player.avatar }}
                            style={{ width: 36, height: 36, borderRadius: 18 }}
                          />
                        ) : (
                          <Ionicons
                            name={player.isReady ? "person" : "person-outline"}
                            size={20}
                            color="#fff"
                          />
                        )}
                      </LinearGradient>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          {player.name}
                        </Text>
                        <Text
                          style={{
                            color: player.isReady ? "#4caf50" : "#ff9800",
                            fontSize: 12,
                          }}
                        >
                          {player.isReady ? "Ready" : "Waiting..."}
                        </Text>
                      </View>
                    </View>

                    {player.isHost && (
                      <LinearGradient
                        colors={["#38f9d7", "#4ECDC4"]}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 16,
                        }}
                      >
                        <Text
                          style={{
                            color: "#0f1420",
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          HOST
                        </Text>
                      </LinearGradient>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={handleStartGame}
                disabled={!canStartGame}
                style={{
                  opacity: canStartGame ? 1 : 0.6,
                  transform: [{ scale: canStartGame ? 1 : 0.98 }],
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    canStartGame ? ["#43e97b", "#38f9d7"] : ["#666", "#777"]
                  }
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                  >
                    {canStartGame ? "Start Game" : "Waiting for players..."}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLeaveRoom}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.2)",
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}
                >
                  Leave Room
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

export default CreateGameModal;
