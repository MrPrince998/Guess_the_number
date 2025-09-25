import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Footer = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerBtn}
        onPress={() => navigation.navigate("Main")}
      >
        <Ionicons name="home" size={30} color="#fff" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerBtn}>
        <Ionicons name="logo-game-controller-a" size={30} color="#fff" />
        <Text style={styles.footerText}>Games</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerBtn}>
        <Ionicons name="stats" size={30} color="#fff" />
        <Text style={styles.footerText}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerBtn}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person" size={30} color="#fff" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerBtn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#1f2937",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
