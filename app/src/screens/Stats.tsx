import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const StatsScreen = () => {
  // Sample player data
  const playerStats = {
    username: "NumberNinja",
    avatar: "👑", // You can replace with actual image
    totalGames: 147,
    gamesWon: 89,
    gamesLost: 58,
    currentStreak: 5,
    winPercentage: 60.5,
  };

  const progressBarWidth = new Animated.Value(0);

  React.useEffect(() => {
    // Animate progress bars on mount
    Animated.timing(progressBarWidth, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const winPercentageWidth = progressBarWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${playerStats.winPercentage}%`],
  });

  // Custom pie chart component
  const CustomPieChart = ({
    wins,
    losses,
  }: {
    wins: number;
    losses: number;
  }) => {
    const total = wins + losses;
    const winsPercentage = (wins / total) * 100;
    const radius = 60;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const winsStroke = (winsPercentage / 100) * circumference;

    return (
      <View style={styles.pieChartContainer}>
        <Svg width={140} height={140}>
          <G x={70} y={70}>
            {/* Background circle */}
            <Circle
              r={radius}
              stroke="#F44336"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Wins circle */}
            <Circle
              r={radius}
              stroke="#4CAF50"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${winsStroke} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90)"
            />
          </G>
        </Svg>
        <View style={styles.pieChartCenter}>
          <Text style={styles.pieChartPercentage}>
            {Math.round(winsPercentage)}%
          </Text>
          <Text style={styles.pieChartLabel}>Wins</Text>
        </View>
      </View>
    );
  };

  const StatCard = ({ title, value, icon, color, gradient, subtitle }: any) => (
    <LinearGradient
      colors={gradient}
      style={[styles.statCard, { borderLeftColor: color }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </LinearGradient>
  );

  const ProgressStat = ({ label, value, max, color, icon }: any) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <View style={styles.progressLabel}>
          <Ionicons name={icon} size={16} color={color} />
          <Text style={styles.progressText}>{label}</Text>
        </View>
        <Text style={[styles.progressValue, { color }]}>
          {value}/{max}
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: color,
              width: progressBarWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", `${(value / max) * 100}%`],
              }),
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Stats</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Player Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{playerStats.avatar}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{playerStats.username}</Text>
            <Text style={styles.playerLevel}>Number Master</Text>
          </View>
        </View>

        {/* Win Percentage Circle */}
        <View style={styles.winPercentageContainer}>
          <View style={styles.circleProgress}>
            <Text style={styles.winPercentage}>
              {playerStats.winPercentage}%
            </Text>
            <Text style={styles.winLabel}>Win Rate</Text>
          </View>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={24} color="#FF9800" />
            <Text style={styles.streakText}>
              {playerStats.currentStreak} day streak
            </Text>
          </View>
        </View>

        {/* Main Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Games Played"
            value={playerStats.totalGames}
            icon="game-controller"
            color="#2196F3"
            gradient={["rgba(33, 150, 243, 0.1)", "rgba(33, 150, 243, 0.05)"]}
            subtitle="total"
          />
          <StatCard
            title="Games Won"
            value={playerStats.gamesWon}
            icon="trophy"
            color="#4CAF50"
            gradient={["rgba(76, 175, 80, 0.1)", "rgba(76, 175, 80, 0.05)"]}
            subtitle="total"
          />
          <StatCard
            title="Games Lost"
            value={playerStats.gamesLost}
            icon="skull"
            color="#F44336"
            gradient={["rgba(244, 67, 54, 0.1)", "rgba(244, 67, 54, 0.05)"]}
            subtitle="total"
          />
          <StatCard
            title="Current Streak"
            value={playerStats.currentStreak}
            icon="flash"
            color="#FF9800"
            gradient={["rgba(255, 152, 0, 0.1)", "rgba(255, 152, 0, 0.05)"]}
            subtitle="days"
          />
        </View>

        {/* Progress Bars */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          <ProgressStat
            label="Win Percentage"
            value={playerStats.winPercentage}
            max={100}
            color="#4CAF50"
            icon="trending-up"
          />
          <ProgressStat
            label="Games Completed"
            value={playerStats.totalGames}
            max={200}
            color="#2196F3"
            icon="checkmark-done"
          />
        </View>

        {/* Pie Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Win/Loss Ratio</Text>
          <View style={styles.chartWrapper}>
            <CustomPieChart
              wins={playerStats.gamesWon}
              losses={playerStats.gamesLost}
            />
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#4CAF50" }]}
                />
                <Text style={styles.legendText}>
                  Wins ({playerStats.gamesWon})
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#F44336" }]}
                />
                <Text style={styles.legendText}>
                  Losses ({playerStats.gamesLost})
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="share-social" size={20} color="#2196F3" />
            <Text style={styles.secondaryButtonText}>Share Stats</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "System",
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatar: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  playerLevel: {
    fontSize: 16,
    color: "#BB86FC",
    fontWeight: "500",
  },
  winPercentageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  circleProgress: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 4,
    borderColor: "#4CAF50",
  },
  winPercentage: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  winLabel: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    padding: 12,
    borderRadius: 20,
  },
  streakText: {
    color: "#FF9800",
    fontWeight: "600",
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "48%",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    borderLeftWidth: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statSubtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
  progressSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  chartWrapper: {
    alignItems: "center",
  },
  pieChartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  pieChartCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pieChartPercentage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  pieChartLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 2,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: "#fff",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: "#2196F3",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default StatsScreen;
