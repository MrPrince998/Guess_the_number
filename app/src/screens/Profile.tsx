import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Alert,
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
import { useAuth } from "../providers/auth-providers";
import { NavigationProp } from "../types/navigateProps.types";
import { ProgressItemProps } from "../types/types";

const { width } = Dimensions.get("window");

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    logout,
    handleDeleteAccount,
    user,
    levelData,
    isLoggedIn,
    achievements,
  } = useAuth();

  // Multiple animations for better effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
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

  const goBack = () => navigation.goBack();
  const handleSettings = () => navigation.navigate("Settings");
  const handleEditProfile = () => navigation.navigate("EditProfile");
  const handleChangePassword = () => navigation.navigate("ChangePassword");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const deleteAccountDialog = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ]
    );
  };

  const statsData = [
    {
      icon: "shield",
      value: `${user?.level || 0}`,
      label: "Level",
      gradient: ["#4ECDC4", "#44A08D"] as const,
    },
    {
      icon: "game-controller",
      value: `${user?.game_played || 0}`,
      label: "Games Played",
      gradient: ["#667eea", "#764ba2"] as const,
    },
    {
      icon: "trophy",
      value: `${user?.games_won || 0}`,
      label: "Wins",
      gradient: ["#FFD700", "#FFA500"] as const,
    },
    {
      icon: "swap-horizontal",
      value: `${user?.games_lost || 0}`,
      label: "Losses",
      gradient: ["#FF6B6B", "#EE5A52"] as const,
    },
  ];

  const menuItems: Array<{
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    color: string;
    gradient: readonly [string, string];
    isDestructive?: boolean;
  }> = [
    {
      icon: "create",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      onPress: handleEditProfile,
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#44A08D"] as const,
    },
    {
      icon: "key",
      title: "Change Password",
      subtitle: "Secure your account with new password",
      onPress: handleChangePassword,
      color: "#FFD93D",
      gradient: ["#FFD93D", "#FF9A3D"] as const,
    },
    {
      icon: "stats-chart",
      title: "Game Statistics",
      subtitle: "View detailed game analytics",
      onPress: () => navigation.navigate("Statistics"),
      color: "#6BCF7F",
      gradient: ["#6BCF7F", "#4CAF50"] as const,
    },
    {
      icon: "notifications",
      title: "Notification Settings",
      subtitle: "Manage your notification preferences",
      onPress: () => navigation.navigate("Notifications"),
      color: "#FF9A3D",
      gradient: ["#FF9A3D", "#FF6B6B"] as const,
    },
    {
      icon: "trash",
      title: "Delete Account",
      subtitle: "Permanently remove your account",
      onPress: deleteAccountDialog,
      color: "#FF6B6B",
      gradient: ["#FF6B6B", "#C44569"] as const,
      isDestructive: true,
    },
    {
      icon: "log-out",
      title: "Logout",
      subtitle: "Sign out of your account",
      onPress: handleLogout,
      color: "#FF6B6B",
      gradient: ["#FF6B6B", "#C44569"] as const,
      isDestructive: true,
    },
  ];

  const guestUserMenuItems: Array<{
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    color: string;
    gradient: readonly [string, string];
    isDestructive?: boolean;
  }> = [
    {
      icon: "log-in",
      title: "Login / Signup",
      subtitle: "Access your account or create a new one",
      onPress: () => navigation.navigate("Login"),
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#44A08D"] as const,
    },
  ];

  // const achievements = [
  //   { name: "First Win", unlocked: true, icon: "trophy" },
  //   { name: "5 Game Streak", unlocked: true, icon: "flash" },
  //   { name: "Quick Thinker", unlocked: false, icon: "speedometer" },
  //   { name: "Master Player", unlocked: false, icon: "star" },
  // ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <Pressable onPress={goBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerText}>Profile</Text>
        <Pressable onPress={handleSettings} style={styles.iconButton}>
          <Ionicons name="settings" size={22} color="#fff" />
        </Pressable>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Animated.View
          style={[
            styles.profileSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.avatarGradient}
            >
              {user?.user_images ? (
                <Image
                  source={{ uri: user.user_images }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={50} color="#fff" />
              )}
            </LinearGradient>
            {user?.is_online && <View style={styles.onlineIndicator} />}
          </View>

          <Text style={styles.username}>{user?.username || "guest"}</Text>
          <Text style={styles.email}>{user?.email || "user@example.com"}</Text>
          <Text style={styles.memberSince}>
            Member since{" "}
            {user?.created_at
              ? new Date(user.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </Text>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          {statsData.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <LinearGradient
                colors={stat.gradient}
                style={styles.statGradient}
              >
                <Ionicons name={stat.icon as any} size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Progress Section */}
        <Animated.View
          style={[
            styles.progressSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <ProgressItem
            label="Level Progress"
            value={
              (levelData?.find((l) => l.level === user?.level)?.required_xp
                ? ((user?.experiences ?? 0) /
                    levelData.find((l) => l.level === user?.level)!
                      .required_xp) *
                  100
                : 0) || 0
            }
            color="#FF6B6B"
            displayValue={`${
              ((user?.experiences || 0) /
                (levelData?.find((l) => l.level === user?.level)?.required_xp ??
                  levelData?.[0]?.required_xp ??
                  1)) *
              100
            }%`}
          />
          <ProgressItem
            label="Win Rate"
            value={
              user?.game_played && user?.games_won
                ? Math.round((user.games_won / user.game_played) * 100)
                : 0
            }
            color="#4ECDC4"
            displayValue={`${
              user?.games_won && user?.game_played
                ? Math.round((user.games_won / user.game_played) * 100)
                : 0
            }%`}
          />
          <ProgressItem
            label="Experience Points"
            value={user?.experiences ? (user.experiences / 2000) * 100 : 0}
            color="#FFD93D"
            displayValue={`${user?.experiences || 0}/${
              // find the level object that matches the user level
              levelData?.find((l) => l.level === user?.level)?.required_xp ||
              levelData?.[0]?.required_xp
            } XP`}
          />
          {/* <ProgressItem
            label="coin"
            value={user?.coin ? (user.coin / 2000) * 100 : 0}
            color="#6BCF7F"
            displayValue={`${user?.coin || 0}`}
          /> */}
        </Animated.View>

        {/* Achievements */}
        <Animated.View
          style={[styles.achievementsSection, { opacity: fadeAnim }]}
        >
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    !user?.achievements?.find(
                      (achiv) =>
                        achiv.achievement_id === achievement.id &&
                        achiv.unlocked_at
                    ) && styles.achievementLocked,
                  ]}
                >
                  <Image
                    source={{ uri: achievement.icon_url }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </View>
                <Text
                  style={[
                    styles.achievementText,
                    !user?.achievements?.find(
                      (achiv) =>
                        achiv.achievement_id === achievement.id &&
                        achiv.unlocked_at
                    ) && styles.achievementTextLocked,
                  ]}
                >
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          }}
        >
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {isLoggedIn
            ? menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={item.onPress}
                  style={[
                    styles.menuItem,
                    item.isDestructive && styles.destructiveItem,
                  ]}
                  disabled={item.title === "Delete Account" && !isLoggedIn}
                >
                  <LinearGradient
                    colors={item.gradient}
                    style={styles.menuIconContainer}
                  >
                    <Ionicons name={item.icon as any} size={20} color="#fff" />
                  </LinearGradient>

                  <View style={styles.menuText}>
                    <Text
                      style={[
                        styles.menuTitle,
                        { color: item.isDestructive ? "#FF6B6B" : "#fff" },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={item.isDestructive ? "#FF6B6B" : "#666"}
                  />
                </TouchableOpacity>
              ))
            : guestUserMenuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={item.onPress}
                  style={[
                    styles.menuItem,
                    item.isDestructive && styles.destructiveItem,
                  ]}
                  disabled={item.title === "Delete Account" && !isLoggedIn}
                >
                  <LinearGradient
                    colors={item.gradient}
                    style={styles.menuIconContainer}
                  >
                    <Ionicons name={item.icon as any} size={20} color="#fff" />
                  </LinearGradient>

                  <View style={styles.menuText}>
                    <Text
                      style={[
                        styles.menuTitle,
                        { color: item.isDestructive ? "#FF6B6B" : "#fff" },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={item.isDestructive ? "#FF6B6B" : "#666"}
                  />
                </TouchableOpacity>
              ))}
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const ProgressItem = ({
  label,
  value,
  color,
  displayValue,
}: ProgressItemProps) => (
  <View style={styles.progressItem}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={[styles.progressValue, { color }]}>{displayValue}</Text>
    </View>
    <View style={styles.progressBarBackground}>
      <LinearGradient
        colors={[color, `${color}80`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressBarFill, { width: `${value}%` }]}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131a29",
    paddingBottom: 0,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4ECDC4",
    borderWidth: 2,
    borderColor: "#131a29",
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 4,
  },
  memberSince: {
    color: "#666",
    fontSize: 14,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    color: "#ccc",
    fontSize: 11,
    textAlign: "center",
  },
  progressSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 24,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  progressBarBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  achievementsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 24,
    marginVertical: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  achievementLocked: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    opacity: 0.5,
  },
  achievementText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  achievementTextLocked: {
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
  },
  destructiveItem: {
    backgroundColor: "rgba(255, 107, 107, 0.08)",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#ccc",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 12,
  },
});

export default Profile;
