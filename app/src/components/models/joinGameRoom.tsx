import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { useAuth } from "../../providers/auth-providers";

const codeSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters long"),
});
const JoinGameModal = ({
  onClose,
  onSubmit,
  visible,
}: {
  onClose: () => void;
  onSubmit: (data: { code: string }) => void;
  visible: boolean;
}) => {
  const [joinAs, setJoinAs] = useState<"registered" | "guest">("registered");

  const { isLoggedIn } = useAuth();
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
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 20,
          width: "100%",
          maxWidth: 400,
          gap: 15,
          position: "relative",
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Join Room</Text>
          <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#ccc",
            width: "100%",
            marginVertical: 10,
          }}
        />
        <View style={{ alignItems: "center", gap: 10 }}>
          <View
            style={{
              backgroundColor: "#007bff",
              padding: 20,
              borderRadius: 50,
            }}
          >
            <Ionicons name="game-controller" size={64} color="white" />
          </View>
          <Text style={{ textAlign: "center", color: "#555" }}>
            Enter the room code to join your friends in an exciting multiplayer
            game session
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 10,
            textAlign: "left",
          }}
        >
          Room Code
        </Text>
        <TextInput
          placeholder="ENTER 6-DIGIT CODE"
          style={{
            width: "100%",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: 20,
            paddingHorizontal: 10,
            fontSize: 16,
            textAlign: "center",
            textTransform: "uppercase",
            backgroundColor: "#c4c4c4ff",
            fontWeight: "bold",
            color: "#202020ff",
          }}
          maxLength={6}
          autoCapitalize="characters"
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="person-circle" size={26} color="#888" />
          <Text style={{ color: "#888", fontSize: 18 }}>Join as:</Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => setJoinAs("registered")}
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                backgroundColor:
                  joinAs === "registered" ? "#007bff" : "#e0e0e0",
                justifyContent: "center",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Ionicons
                name={joinAs === "registered" ? "person" : "person-outline"}
                size={24}
                color={joinAs === "registered" ? "white" : "black"}
              />
              <Text
                style={{
                  color: joinAs === "registered" ? "white" : "black",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Registered
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setJoinAs("guest")}
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: joinAs === "guest" ? "#007bff" : "#e0e0e0",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Ionicons
                name={joinAs === "guest" ? "person-add" : "person-add-outline"}
                size={24}
                color={joinAs === "guest" ? "white" : "black"}
              />
              <Text
                style={{
                  color: joinAs === "guest" ? "white" : "black",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Guest
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onSubmit({ code: "ABCDEF" })}
          style={{
            backgroundColor: isLoggedIn ? "#007bff" : "#5381b1ff",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            width: "100%",
          }}
          disabled={!isLoggedIn}
        >
          <Ionicons name="enter" size={24} color="white" />
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            Join Game
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: 15,
            borderRadius: 10,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            backgroundColor: "#e0e0e0",
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JoinGameModal;
