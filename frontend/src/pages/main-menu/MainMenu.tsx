import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostHook, getErrorMessage, GetHook } from "@/hook/apiCall";
import { Crown, Link, Swords, Zap } from "lucide-react";
import { FaUserAlt } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoginSignup from "../login-page/LoginSignup";
import CreateRoom from "@/components/model/CreateRoom";
import JoinRoom from "@/components/model/JoinRoom";
import { BaseURL } from "@/components/constant/constant";

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

interface RoomDetails {
  id: string;
  roomCode: string;
  players: string[];
  isActiveRoom: boolean;
  isGameStarted?: boolean;
  playersCount?: number;
  roomCreator?: string;
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
  isReady: boolean;
  hasSecretCode: boolean;
  isJoined: boolean;
  role: string;
}

export interface roomStatus {
  room: RoomDetails;
  players: RoomPlayer[];
  canStartGame: boolean;
}

interface HeartBeatResponse {
  message: string;
}

const MainMenu = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<
    "first" | "second" | "third" | "profile" | "createRoom" | "joinRoom" | null
  >(null);

  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const guestPlayer = userId.startsWith("guest_");

  const { data: userDetails, error: userError } = GetHook<UserDetails>(
    ["userProfile", userId],
    `/api/user/profile/${userId}`,
    {
      enabled: !!userId && !guestPlayer, // Only fetch if userId exists
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: true, // Don't refetch on window focus
      refetchInterval: 5000,
    }
  );

  console.log("User Details:", userId.startsWith("guest-"));

  const roomCode = roomDetails?.roomCode || ""; // helper

  const getRoomStatus = GetHook<roomStatus>(
    ["roomStatus", roomCode],
    roomCode ? `${BaseURL}/api/room/rooms/${roomCode}/status` : "",
    {
      enabled: !!roomCode,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    }
  );

  const playerHearbeat = GetHook<HeartBeatResponse>(
    ["heartbeat", roomCode, userId],
    roomCode && userId
      ? `${BaseURL}/api/room/rooms/${roomCode}/players/${userId}/heartbeat`
      : "",
    {
      enabled: !!roomCode && !!userId,
      refetchOnWindowFocus: true,
      refetchInterval: 15000,
      refetchIntervalInBackground: true,
    }
  );

  const getUserId = (): string | null => {
    return userId; // Use the state instead of re-parsing localStorage
  };

  const handleMaintainence = () => {
    toast.error("This feature is under maintenance.");
  };

  const { mutate, isPending } = PostHook<CreateGameResponse, CreateGamePayload>(
    "post",
    "/api/room/create",
    ["create-game"]
  );

  const handleCreateGame = () => {
    const userID = getUserId();

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

  const handleProfileClick = () => {
    setOpenDialog("profile");
  };

  // ✅ FIXED: Handle user profile loading error
  useEffect(() => {
    if (userError) {
      console.error("Failed to load user profile:", userError);
      // Optionally show a toast or handle the error
    }
  }, [userError]);

  return (
    <div className="bg-background min-h-screen w-full px-8 py-4 flex items-start justify-center relative">
      <div className="flex flex-col items-center w-full max-w-2xl px-4 py-12">
        <h1 className="text-primary font-bold text-4xl my-8">
          GUESS THE NUMBER
        </h1>
        <div className="flex flex-col items-center space-y-4 max-w-sm w-full p-6 bg-white rounded-3xl shadow-lg">
          <Dialog
            open={openDialog === "first"}
            onOpenChange={(open) => setOpenDialog(open ? "first" : null)}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full py-4 text-secondary font-bold text-lg"
              >
                Play Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Game Mode</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>
              <div className="flex flex-col items-center gap-4 py-4">
                <Button
                  className="w-full py-4 font-bold text-lg"
                  onClick={handleMaintainence}
                  disabled={isPending}
                >
                  <Zap className="mr-2" />
                  Quick Play
                </Button>

                <div className="flex items-center justify-center gap-4 w-full">
                  <span className="h-0.5 bg-secondary w-full rounded-full"></span>
                  <Swords size={40} className="text-secondary" />
                  <span className="h-0.5 bg-secondary w-full rounded-full"></span>
                </div>

                <Button
                  variant="ghost"
                  className="w-full py-4 text-secondary font-bold text-lg"
                  onClick={handleCreateGame}
                  disabled={isPending}
                >
                  <Crown className="mr-2" />
                  {isPending ? "Creating..." : "Create Game"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full py-4 text-secondary font-bold text-lg"
                  onClick={() => {
                    setOpenDialog("joinRoom");
                  }}
                >
                  <Link className="mr-2" />
                  Join Game
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDialog === "second"}
            onOpenChange={(open) => setOpenDialog(open ? "second" : null)}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full py-4 text-secondary font-bold text-lg"
              >
                How to Play
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  How to Play
                </DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>1.</strong> Create or join a room with another player
                </p>
                <p>
                  <strong>2.</strong> Set your secret 4-digit number
                </p>
                <p>
                  <strong>3.</strong> Take turns guessing each other's number
                </p>
                <p>
                  <strong>4.</strong> First to guess correctly wins!
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            className="w-full py-4 text-secondary font-bold text-lg"
            onClick={handleMaintainence}
          >
            Leaderboard
          </Button>

          <Button
            variant="ghost"
            className="w-full py-4 text-secondary font-bold text-lg"
            onClick={handleMaintainence}
          >
            About Us
          </Button>

          <Button
            variant="ghost"
            className="w-full py-4 text-secondary font-bold text-lg"
            onClick={() => navigate("/")}
          >
            Exit
          </Button>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex gap-4">
        <button
          className="h-10 w-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
          onClick={handleMaintainence}
          aria-label="Settings"
        >
          <IoSettingsSharp size={25} />
        </button>
        <button
          className="h-10 w-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
          onClick={handleProfileClick}
          aria-label="Profile"
        >
          <FaUserAlt size={25} />
        </button>
      </div>

      <LoginSignup
        open={openDialog === "profile"}
        onOpenChange={(open: boolean) => setOpenDialog(open ? "profile" : null)}
        onSuccess={() => {
          setOpenDialog(null);
          toast.success("Welcome back!");
          // ✅ FIXED: Update userId state after login
          const user = localStorage.getItem("user");
          if (user) {
            try {
              const parsedUser = JSON.parse(user);
              setUserId(parsedUser.id);
            } catch (error) {
              console.error("Error parsing user data:", error);
            }
          }
        }}
      />

      <CreateRoom
        open={openDialog === "createRoom"}
        onOpenChange={(open: boolean) =>
          setOpenDialog(open ? "createRoom" : null)
        }
        creatorId={getUserId()}
        roomDetails={roomDetails}
        onSuccess={() => {
          setRoomDetails(null);
        }}
        roomStatus={getRoomStatus.data}
        onError={() => {
          setRoomDetails(null);
        }}
      />
      <JoinRoom
        open={openDialog === "joinRoom"}
        onOpenChange={(open: boolean) =>
          setOpenDialog(open ? "joinRoom" : null)
        }
        creatorId={userId}
        onSuccess={(data) => {
          setRoomDetails(data.room);
          setUserId((prev) => prev || data.playerStatus.playerId);
          setOpenDialog("createRoom");
        }}
      />
    </div>
  );
};

export default MainMenu;
