import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PostHook } from "@/hook/apiCall";
import type {
  CreateGameResponse,
  roomStatus,
} from "@/pages/main-menu/MainMenu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Check,
  Copy,
  Users,
  X,
  Search,
  Trophy,
  Clock,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
import { BaseURL, UserDetails } from "../constant/constant";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RoomDetails {
  id: string;
  roomCode: string;
  players: string[];
  isActiveRoom: boolean;
  isGameStarted?: boolean;
  maxPlayers?: number;
}

interface CreateRoomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  roomDetails?: RoomDetails | null;
  creatorId?: string | null;
  roomStatus?: roomStatus;
  onError?: () => void;
}

interface emptyPayload {}

interface GameStartResponse {
  message: string;
  room: RoomDetails;
}
const CreateRoom = ({
  open,
  onOpenChange,
  roomDetails,
  onSuccess,
  roomStatus,
  onError,
}: CreateRoomProps) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const players = roomStatus?.players || roomDetails?.players || [];

  console.log("Room Details:", roomStatus);
  useEffect(() => {
    if (roomDetails?.roomCode) {
      setInviteLink(`${BaseURL}/join/${roomDetails.roomCode}`);
    }
  }, [roomDetails]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showCountdown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      handleStart();
    }
    return () => clearTimeout(timer);
  }, [countdown, showCountdown]);

  const deleteRoom = PostHook<CreateGameResponse, emptyPayload>(
    "delete",
    `${BaseURL}/api/room/rooms/${roomDetails?.roomCode}/players/${UserDetails?.id}`,
    ["exit-room"]
  );

  const handleCancel = () => {
    if (!roomDetails?.roomCode || !UserDetails?.id) {
      toast.error("Missing room or user information");
      onOpenChange(false);
      onError?.();
      return;
    }

    deleteRoom.mutate(
      {},
      {
        onSuccess: (data) => {
          toast.success(`${data.message}`);
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error exiting room:", error);
          toast.error("Failed to exit room");
          onOpenChange(false);
          onError?.();
        },
      }
    );
  };

  const handleStart = () => {
    if (roomDetails?.roomCode) {
      navigate(`/room/${roomDetails.roomCode}`);
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast.error("Room code not available");
    }
  };

  useEffect(() => {
    if (roomStatus?.room?.isGameStarted) {
      console.log("Game has started, showing countdown");
      setShowCountdown(true);
      setCountdown(5);
    }
  }, [roomStatus?.room?.isGameStarted]);

  const gameStart = PostHook<GameStartResponse, emptyPayload>(
    "patch",
    `${BaseURL}/api/room/rooms/${roomDetails?.roomCode}/start`,
    ["start-game"]
  );
  const handleStartCountdown = () => {
    if (players.length === 2) {
      gameStart.mutate(
        {},
        {
          onSuccess: (data) => {
            toast.success(data.message);
            // Optionally navigate to the game room
            // navigate(`/room/${data.room.roomCode}`);
            // onSuccess?.();
          },
          onError: (error) => {
            const errorMessage =
              error.response?.data?.message || "Failed to start game";
            toast.error(errorMessage);
          },
        }
      );
    } else {
      toast.error("You need 2 players to start the game!");
    }
  };

  console.log(roomDetails);
  const handleCopy = async (text: string | undefined) => {
    if (!text) {
      toast.error("Nothing to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  // if (!roomDetails) {
  //   return (
  //     <Dialog open={open} onOpenChange={onOpenChange}>
  //       <DialogContent className="sm:max-w-[400px] bg-gradient-to-b from-blue-50 to-indigo-50">
  //         <DialogHeader>
  //           <DialogTitle className="text-indigo-600">Loading...</DialogTitle>
  //           <DialogDescription>
  //             Preparing your number guessing battle...
  //           </DialogDescription>
  //         </DialogHeader>
  //         <div className="flex justify-end">
  //           <Button variant="outline" onClick={() => onOpenChange(false)}>
  //             Close
  //           </Button>
  //         </div>
  //       </DialogContent>
  //     </Dialog>
  //   );
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl border-0 bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden p-0">
        {/* Header with game title */}
        <div className="bg-indigo-600 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="w-8 h-8" />
                <div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    Number Guessing Duel
                  </DialogTitle>
                  <DialogDescription className="text-indigo-100">
                    {roomStatus?.room?.isGameStarted
                      ? "Game in progress!"
                      : "Waiting for opponent..."}
                  </DialogDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="px-3 py-1 bg-white text-indigo-600"
              >
                <Users className="w-4 h-4 mr-1" />
                {players.length || 1}/2
              </Badge>
            </div>
          </DialogHeader>
        </div>

        {/* Main content */}
        <div className="p-6 space-y-6">
          {showCountdown ? (
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="text-5xl font-bold text-indigo-600 mb-4">
                {countdown}
              </div>
              <p className="text-lg text-indigo-800">Game starting in...</p>
              <Sparkles className="w-10 h-10 mt-4 text-yellow-400 animate-pulse" />
            </motion.div>
          ) : (
            <>
              {/* Game info cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Trophy className="w-5 h-5" />
                    <h3 className="font-medium">Prize</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Victory rewards you with coins
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-medium">Rules</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Outsmart your rival by cracking their secret vault code
                    before they crack yours!
                  </p>
                </div>
              </div>

              {/* Room code section */}
              <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                <h3 className="font-medium text-indigo-700 mb-2 flex items-center gap-2">
                  <Copy className="w-4 h-4" /> Challenge Code
                </h3>
                <div className="flex items-center gap-2">
                  <Input
                    value={roomDetails?.roomCode}
                    readOnly
                    className="font-mono text-lg font-bold tracking-wider bg-indigo-50 border-indigo-200 text-indigo-700"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(roomDetails?.roomCode)}
                    className="border-indigo-200 hover:bg-indigo-50"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Players section */}
              <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                <h3 className="font-medium text-indigo-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Duelists
                </h3>
                <div className="space-y-3">
                  {roomStatus?.players.map((player, index) => {
                    console.log("Player:", player);
                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          player.id === UserDetails?.id
                            ? "bg-indigo-50 border border-indigo-200"
                            : "bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="border-2 border-indigo-200">
                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                              {player.id === UserDetails?.id ? "YOU" : "OPP"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {player.id === UserDetails?.id
                                ? "You"
                                : "Opponent"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {player.id === roomStatus.room?.roomCreator
                                ? "Creator"
                                : "Challenger"}
                            </div>
                          </div>
                        </div>
                        {player?.isJoined ? (
                          <Badge
                            variant="secondary"
                            className="bg-indigo-100 text-indigo-600"
                          >
                            Ready
                          </Badge>
                        ) : (
                          <Badge variant={"outline"} className="text-gray-500">
                            Not Ready
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                  {players.length < 2 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-dashed border-gray-300 animate-pulse">
                      <Avatar className="border-2 border-dashed border-gray-300">
                        <AvatarFallback className="bg-transparent text-gray-400">
                          ?
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-500">
                          Waiting for opponent
                        </div>
                        <div className="text-xs text-gray-400">
                          Share the code above
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with action buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between gap-3">
          {!showCountdown && (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-red-300 hover:bg-red-50 text-red-600"
                disabled={deleteRoom.isPending}
              >
                <X className="w-4 h-4 mr-2" />
                {deleteRoom.isPending ? "Leaving..." : "Leave Duel"}
              </Button>

              {roomStatus?.room.roomCreator === UserDetails?.id && (
                <Button
                  onClick={handleStartCountdown}
                  className={cn(
                    "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700",
                    "text-white font-bold shadow-md",
                    "transition-all duration-300",
                    players.length === 2 ? "animate-pulse" : ""
                  )}
                  disabled={players.length < 1}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Duel
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoom;
