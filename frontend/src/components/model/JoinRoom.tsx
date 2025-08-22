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
import { Sword, Sparkles, User, UserPlus, Shield, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BaseURL, getCurrentUser } from "../constant/constant";

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
  const [joinCode, setJoinCode] = useState<string>("");
  const [shake, setShake] = useState(false);
  const [joinAsGuest, setJoinAsGuest] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const UserDetails = getCurrentUser();

  const joinRoom = PostHook<JoinRoomResponse, JoinRoomPayload>(
    "post",
    `${BaseURL}/api/room/join`,
    ["join-room"]
  );

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinCode.trim()) {
      triggerShake();
      toast.error("Please enter a room code");
      return;
    }

    if (joinCode.length !== 4) {
      triggerShake();
      toast.error("Room code must be 4 characters");
      return;
    }

    const userId = joinAsGuest ? null : UserDetails?.id || null;

    joinRoom.mutate(
      {
        roomCode: joinCode.toUpperCase(),
        userId: userId,
      },
      {
        onSuccess: (data) => {
          handleJoinSuccess(data);
        },
        onError: (error) => {
          handleJoinError(error);
        },
      }
    );
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleJoinSuccess = (data: JoinRoomResponse) => {
    if (data.token && data.username) {
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
      toast.success(data.message);
    }
    onSuccess(data);
  };

  const handleJoinError = (error: any) => {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    triggerShake();
  };

  const handleCancel = () => {
    setJoinCode("");
    setJoinAsGuest(false);
    onOpenChange(false);
  };

  const isAuthenticated = !!UserDetails?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl border-0 bg-gradient-to-b from-indigo-50 to-blue-50 overflow-hidden p-0 shadow-xl">
        {/* Header with game theme */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-cover" />
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sword className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  Join Code Duel
                </DialogTitle>
                <p className="text-indigo-100">
                  Challenge a friend in the ultimate guessing battle!
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Main content */}
        <div className="p-6">
          <motion.form
            onSubmit={handleJoinRoom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Input field with animation */}
            <div className="space-y-3">
              <label
                htmlFor="roomCode"
                className="text-sm font-medium text-indigo-700 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Challenge Code
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
                    "bg-white border-2 border-indigo-200 focus:border-indigo-500",
                    "h-14 text-xl shadow-sm",
                    shake && "border-red-300"
                  )}
                  disabled={joinRoom.isPending}
                />
              </motion.div>
              <p className="text-xs text-gray-500">
                Get the 4-digit code from the room creator
              </p>
            </div>

            {/* User type selection */}
            {!isAuthenticated && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-indigo-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Join as:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={!joinAsGuest ? "default" : "outline"}
                    onClick={() => setJoinAsGuest(false)}
                    className="h-12 gap-2"
                    disabled={joinRoom.isPending}
                  >
                    <User className="w-4 h-4" />
                    Registered
                  </Button>
                  <Button
                    type="button"
                    variant={joinAsGuest ? "default" : "outline"}
                    onClick={() => setJoinAsGuest(true)}
                    className="h-12 gap-2"
                    disabled={joinRoom.isPending}
                  >
                    <UserPlus className="w-4 h-4" />
                    Guest
                  </Button>
                </div>
                <AnimatePresence>
                  {joinAsGuest && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                        <strong>Guest Note:</strong> Your progress will be
                        temporary. Register to save your stats.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Expandable game rules */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setShowRules(!showRules)}
              >
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  How to Play
                </span>
                <span>{showRules ? "−" : "+"}</span>
              </Button>

              <AnimatePresence>
                {showRules && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm space-y-2 text-sm">
                      <p>
                        <strong>1.</strong> Each player sets a secret 4-digit
                        code
                      </p>
                      <p>
                        <strong>2.</strong> Take turns guessing the opponent's
                        code
                      </p>
                      <p>
                        <strong>3.</strong> Receive hints (too high/too low)
                      </p>
                      <p>
                        <strong>4.</strong> First to crack the code wins!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-red-300 hover:bg-red-50"
                disabled={joinRoom.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={cn(
                  "flex-1 py-3 text-base font-bold",
                  "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700",
                  "text-white shadow-lg transition-all duration-300",
                  "flex items-center justify-center gap-2"
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
                    <Sparkles className="w-5 h-5" />
                    {joinAsGuest ? "Play as Guest" : "Join Battle"}
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
