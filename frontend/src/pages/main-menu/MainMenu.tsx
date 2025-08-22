import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostHook, getErrorMessage, GetHook } from "@/hook/apiCall";
import {
  Crown,
  Link,
  Swords,
  Zap,
  Settings,
  Trophy,
  Info,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoginSignup from "../login-page/LoginSignup";
import CreateRoom from "@/components/model/CreateRoom";
import JoinRoom from "@/components/model/JoinRoom";
import { BaseURL } from "@/components/constant/constant";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import titleBackground from "@/assets/Lucid_Origin_Vibrant_highresolution_background_for_a_playful_n_3.jpg";

export interface CreateGameResponse {
  message: string;
  room: {
    id: string;
    roomCode: string;
    players: string[];
    isActiveRoom: boolean;
    playersCount: number;
  };
  playerStatus: {
    id: string;
    playerId: string;
    isPlayerJoined: boolean;
    role: string;
    isReady: boolean;
  };
}

interface CreateGamePayload {
  userId: string;
}

export interface RoomDetails {
  id: string;
  roomCode: string;
  players: string[];
  isActiveRoom: boolean;
  isGameStarted?: boolean;
  playersCount?: number;
  winnerPlayerId?: string;
  roomCreator?: string;
  guessHistory?: {
    playerId: string;
    guess: number;
    result: string;
    timestamp: Date;
  }[];
}

export interface UserDetails {
  id: string;
  username: string;
  email: string;
  userLevel: number;
  userExperience: number;
  userCoin: number;
  userGamePlayed: number;
  userWinStreak: number;
}

export interface RoomPlayer {
  id: string;
  playerName: string;
  isReady: boolean;
  hasTurn: boolean;
  hasSecretCode: boolean;
  isJoined: boolean;
  role: string;
  isWinner?: boolean;
}

export interface roomStatus {
  room: RoomDetails;
  players: RoomPlayer[];
  canStartGame: boolean;
}

export interface HeartBeatResponse {
  message: string;
}

const MainMenu = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<
    "first" | "second" | "third" | "profile" | "createRoom" | "joinRoom" | null
  >(null);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [isHovering, setIsHovering] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserId(parsed.id);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  console.log(userId);
  const guestPlayer = userId.startsWith("guest_");

  const { error: userError } = GetHook<UserDetails>(
    ["userProfile", userId],
    `/api/user/profile/${userId}`,
    {
      enabled: !!userId && !guestPlayer,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
    }
  );

  const roomCode = roomDetails?.roomCode || "";

  const getRoomStatus = GetHook<roomStatus>(
    ["roomStatus", roomCode],
    roomCode ? `${BaseURL}/api/room/rooms/${roomCode}/status` : "",
    {
      enabled: !!roomCode,
      refetchOnWindowFocus: true,
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
    }
  );

  GetHook<HeartBeatResponse>(
    ["heartbeat", roomCode, userId],
    roomCode && userId
      ? `${BaseURL}/api/room/rooms/${roomCode}/players/${userId}/heartbeat`
      : "",
    {
      enabled: !!roomCode && !!userId,
      refetchOnWindowFocus: true,
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
    }
  );

  const getUserId = (): string | null => {
    return userId;
  };

  const handleMaintenance = () => {
    toast.error("This feature is coming soon!");
  };

  const { mutate, isPending } = PostHook<CreateGameResponse, CreateGamePayload>(
    "post",
    "/api/room/create",
    ["create-game"]
  );

  const handleCreateGame = () => {
    const userID = getUserId();

    console.log(userId);
    if (!userID) {
      toast.error("Please login first");
      setOpenDialog("profile");
      return;
    }
    mutate(
      { userId: userID },
      {
        onSuccess: (data) => {
          setRoomDetails(data.room);
          setOpenDialog("createRoom");
          toast.success(`Room created! Code: ${data.room.roomCode}`);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  useEffect(() => {
    if (userError) {
      console.error("Failed to load user profile:", userError);
    }
  }, [userError]);

  const menuItems = [
    {
      id: "play",
      label: "Play Game",
      icon: <Swords className="mr-2" />,
      action: () => setOpenDialog("first"),
    },
    {
      id: "howToPlay",
      label: "How to Play",
      icon: <Info className="mr-2" />,
      action: () => setOpenDialog("second"),
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: <Trophy className="mr-2" />,
      action: handleMaintenance,
    },
    {
      id: "about",
      label: "About Us",
      icon: <Info className="mr-2" />,
      action: handleMaintenance,
    },
    {
      id: "exit",
      label: "Exit",
      icon: <LogOut className="mr-2" />,
      action: () => navigate("/"),
    },
  ];

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-indigo-900 to-blue-900 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${titleBackground})` }}
    >
      {/* Decorative elements */}
      {/* <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-cover" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" /> */}

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold text-white mb-2 tracking-wide">
          GUESS THE NUMBER
        </h1>
        <p className="text-blue-200">Unlock the Opponent vault!</p>
      </motion.div>

      {/* Main menu */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col items-center space-y-2 p-6">
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setIsHovering(item.id)}
              onHoverEnd={() => setIsHovering(null)}
              className="w-full"
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full py-6 text-lg font-medium text-white hover:bg-white/20",
                  isHovering === item.id && "bg-white/10"
                )}
                onClick={item.action}
              >
                <div className="flex items-center justify-center">
                  {item.icon}
                  {item.label}
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Game mode dialog */}
      <Dialog
        open={openDialog === "first"}
        onOpenChange={(open) => setOpenDialog(open ? "first" : null)}
      >
        <DialogContent className="sm:max-w-md rounded-xl border-0 bg-gradient-to-b from-blue-800 to-indigo-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Choose Your Battle
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <motion.div whileHover={{ scale: 1.03 }} className="w-full">
              <Button
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                onClick={handleMaintenance}
                disabled={isPending}
              >
                <Zap className="mr-2" />
                Quick Play
              </Button>
            </motion.div>

            <div className="flex items-center justify-center gap-4 w-full my-2">
              <span className="h-0.5 bg-white/20 w-full rounded-full"></span>
              <Swords size={24} className="text-white" />
              <span className="h-0.5 bg-white/20 w-full rounded-full"></span>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} className="w-full">
              <Button
                variant="outline"
                className="w-full py-6 text-lg font-bold text-primary border-white/30 hover:bg-white/10"
                onClick={handleCreateGame}
                disabled={isPending}
              >
                <Crown className="mr-2" />
                {isPending ? "Creating..." : "Create Private Game"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="w-full">
              <Button
                variant="outline"
                className="w-full py-6 text-lg font-bold text-primary border-white/30 hover:bg-white/10"
                onClick={() => setOpenDialog("joinRoom")}
              >
                <Link className="mr-2" />
                Join Private Game
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* How to play dialog */}
      <Dialog
        open={openDialog === "second"}
        onOpenChange={(open) => setOpenDialog(open ? "second" : null)}
      >
        <DialogContent className="sm:max-w-md rounded-xl border-0 bg-gradient-to-b from-blue-800 to-indigo-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              How to Play
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full">
                <span className="text-white font-bold">1</span>
              </div>
              <p>Create or join a room with another player</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full">
                <span className="text-white font-bold">2</span>
              </div>
              <p>Set your secret 4-digit number</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full">
                <span className="text-white font-bold">3</span>
              </div>
              <p>Take turns guessing each other's number</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full">
                <span className="text-white font-bold">4</span>
              </div>
              <p>First to guess correctly wins!</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top right buttons */}
      <div className="absolute top-4 right-4 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
          onClick={handleMaintenance}
          aria-label="Settings"
        >
          <Settings className="text-white" size={20} />
        </motion.button>

        {/* Auth and game dialogs */}
        <LoginSignup
          open={openDialog === "profile"}
          onOpenChange={(open: boolean) =>
            setOpenDialog(open ? "profile" : null)
          }
          setOpenDialog={setOpenDialog}
          // onSuccess={() => {
          //   setOpenDialog(null);
          //   toast.success("Welcome back!");
          //   const user = localStorage.getItem("user");
          //   if (user) {
          //     try {
          //       const parsedUser = JSON.parse(user);
          //       setUserId(parsedUser.id);
          //     } catch (error) {
          //       console.error("Error parsing user data:", error);
          //     }
          //   }
          // }}
        />
      </div>

      <CreateRoom
        open={openDialog === "createRoom"}
        onOpenChange={(open: boolean) =>
          setOpenDialog(open ? "createRoom" : null)
        }
        creatorId={getUserId()}
        roomDetails={roomDetails}
        onSuccess={() => setRoomDetails(null)}
        roomStatus={getRoomStatus.data}
        onError={() => setRoomDetails(null)}
      />
      <JoinRoom
        open={openDialog === "joinRoom"}
        onOpenChange={(open) => setOpenDialog(open ? "joinRoom" : null)}
        onSuccess={(data) => {
          setRoomDetails(data.room);
          setUserId(data.playerStatus.playerId); // key: update after guest join
          setOpenDialog("createRoom");
        }}
      />
    </div>
  );
};

export default MainMenu;
