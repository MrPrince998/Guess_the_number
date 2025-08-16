import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PostHook, getErrorMessage } from "@/hook/apiCall";
import { useState } from "react";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { Sword, Zap, Sparkles, User, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
import { BaseURL, UserDetails } from "../constant/constant";

interface JoinRoomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: JoinRoomResponse) => void;
  creatorId?: string | null;
}

interface JoinRoomResponse {
  message: string;
  room: {
    id: string;
    roomCode: string;
    players: string[];
    isActiveRoom: boolean;
    isGameStarted: boolean;
    playersCount: number;
  };
  playerStatus: {
    id: string;
    playerId: string;
    isPlayerJoined: boolean;
    isReady: boolean;
    role: string;
  };
  token?: string;
  username?: string;
}

interface JoinRoomPayload {
  roomCode: string;
  userId: string | null;
}

const JoinRoom = ({ open, onOpenChange, onSuccess }: JoinRoomProps) => {
  // const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState<string>("");
  const [shake, setShake] = useState(false);
  const [joinAsGuest, setJoinAsGuest] = useState(false);

  const joinRoom = PostHook<JoinRoomResponse, JoinRoomPayload>(
    "post",
    `${BaseURL}/api/room/join`,
    ["join-room"]
  );

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinCode.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Please enter a room code");
      return;
    }

    if (joinCode.length !== 4) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Room code must be 4 characters");
      return;
    }

    const userId = joinAsGuest ? null : UserDetails?.id || null;

    const requestData = {
      roomCode: joinCode.toUpperCase(),
      userId: userId,
    };
    joinRoom.mutate(requestData, {
      onSuccess: (data) => {
        if (data.token && data.username) {
          // Guest user - store temporary credentials
          localStorage.setItem("token", data.token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.playerStatus.playerId,
              username: data.username,
              role: "guest",
            })
          );
          toast.success(`Welcome ${data.username}! Joined as guest.`);
        } else {
          // Regular user
          toast.success(data.message);
        }

        // Navigate to the game room
        // navigate(`/room/${data.room.roomCode}`);
        // setOpenDialog?.("createRoom");
        // onOpenChange(false);
        onSuccess(data);
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      },
    });
  };

  const handleCancel = () => {
    setJoinCode("");
    setJoinAsGuest(false);
    onOpenChange(false);
  };

  const isAuthenticated = !!UserDetails?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl border-0 bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden p-0">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Sword className="w-8 h-8" />
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  Join Number Duel
                </DialogTitle>
                <p className="text-indigo-100">
                  Challenge a friend in the guessing battle!
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Main content */}
        <div className="p-6">
          <motion.form
            onSubmit={handleJoinRoom}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Input field */}
            <div className="space-y-2">
              <label
                htmlFor="roomCode"
                className="block text-sm font-medium text-indigo-700"
              >
                Enter Challenge Code
              </label>
              <motion.div
                animate={{
                  x: shake ? [0, -10, 10, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <Input
                  id="roomCode"
                  type="text"
                  placeholder="e.g. X7F9"
                  maxLength={4}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className={cn(
                    "font-mono text-lg font-bold tracking-wider text-center",
                    "bg-white border-indigo-200 focus:border-indigo-400",
                    "h-14 text-xl"
                  )}
                  disabled={joinRoom.isPending}
                />
              </motion.div>
              <p className="text-xs text-gray-500">
                Get the code from your friend who created the duel
              </p>
            </div>

            {/* ✅ FIXED: User type selection */}
            {!isAuthenticated && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-indigo-700">Join as:</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={!joinAsGuest ? "default" : "outline"}
                    onClick={() => setJoinAsGuest(false)}
                    className="h-12"
                    disabled={joinRoom.isPending}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login First
                  </Button>
                  <Button
                    type="button"
                    variant={joinAsGuest ? "default" : "outline"}
                    onClick={() => setJoinAsGuest(true)}
                    className="h-12"
                    disabled={joinRoom.isPending}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Guest
                  </Button>
                </div>
                {joinAsGuest && (
                  <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                    <strong>Note:</strong> As a guest, your progress won't be
                    saved.
                  </p>
                )}
              </div>
            )}

            {/* Game info */}
            <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <h3 className="font-medium text-indigo-700">Game Rules</h3>
                  <p className="text-sm text-gray-600">
                    Outsmart your rival by cracking their secret vault code
                    before they crack yours!
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={joinRoom.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={cn(
                  "flex-1 py-6 text-lg font-bold",
                  "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700",
                  "text-white shadow-md transition-all duration-300"
                )}
                disabled={
                  joinRoom.isPending ||
                  !joinCode.trim() ||
                  (!isAuthenticated && !joinAsGuest)
                }
              >
                {joinRoom.isPending ? (
                  "Joining..."
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {joinAsGuest ? "Join as Guest" : "Accept Challenge"}
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoom;
