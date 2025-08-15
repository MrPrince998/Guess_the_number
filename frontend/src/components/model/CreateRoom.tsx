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
  UserDetails,
} from "@/pages/main-menu/MainMenu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Check, Copy, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BaseURL } from "../constant/constant";

export interface RoomDetails {
  id: string;
  roomCode: string;
  players: string[];
  isActiveRoom: boolean;
  isGameStarted?: boolean;
  maxPlayers?: number;
  gameMode?: string;
}

interface CreateRoomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  roomDetails?: RoomDetails | null;
  creatorId?: string | null;
  UserDetails?: UserDetails;
}

interface ExitRoomPayload {
  roomCode: string;
  userId: string;
}

const CreateRoom = ({
  open,
  onOpenChange,
  roomDetails,
  onSuccess,
  UserDetails,
}: CreateRoomProps) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    if (roomDetails?.roomCode) {
      setInviteLink(`${BaseURL}/join/${roomDetails.roomCode}`);
      setPlayerCount(roomDetails.players?.length || 1);
    }
  }, [roomDetails]);

  const deleteRoom = PostHook<CreateGameResponse, ExitRoomPayload>(
    "post",
    "/api/room/exit",
    ["exit-room"]
  );

  const handleCancel = () => {
    if (!roomDetails?.roomCode || !UserDetails?.id) {
      toast.error("Missing room or user information");
      onOpenChange(false);
      return;
    }

    deleteRoom.mutate(
      {
        roomCode: roomDetails.roomCode,
        userId: UserDetails.id,
      },
      {
        onSuccess: (data) => {
          toast.success(`Room left successfully: ${data}`);
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error exiting room:", error);
          toast.error("Failed to exit room");
          onOpenChange(false);
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

  const handleCopy = async (text: string) => {
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

  // ✅ FIXED: Better player count calculation
  const currentPlayerCount = roomDetails?.players?.length || 1;
  const maxPlayers = roomDetails?.maxPlayers || 2;
  const playerPercentage = Math.min(
    100,
    (currentPlayerCount / maxPlayers) * 100
  );

  // ✅ FIXED: Handle case when roomDetails is null
  if (!roomDetails) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>
              Please wait while we load room details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {roomDetails.gameMode || "Game Room"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                {roomDetails.isGameStarted
                  ? "Game in progress"
                  : "Waiting for players..."}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="w-4 h-4 mr-1" />
              {currentPlayerCount}/{maxPlayers}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Player Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Players joined</span>
              <span>
                {currentPlayerCount}/{maxPlayers}
              </span>
            </div>
            <Progress value={playerPercentage} className="h-2" />
          </div>

          {/* Room Code Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
              Share Room Code
            </h3>
            <div className="flex items-center gap-2">
              <Input
                value={roomDetails.roomCode}
                readOnly
                className="font-mono text-lg font-bold tracking-wider"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(roomDetails.roomCode)}
                disabled={!roomDetails.roomCode}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Invite Link Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
              Or share invite link
            </h3>
            <div className="flex items-center gap-2">
              <Input value={inviteLink} readOnly className="text-sm truncate" />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(inviteLink)}
                disabled={!inviteLink}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Players List */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-3">
              Players ({currentPlayerCount})
            </h3>
            <div className="space-y-3">
              {/* ✅ FIXED: Handle string array instead of object array */}
              {roomDetails.players.map((playerId, index) => (
                <div
                  key={playerId}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>P{index + 1}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Player {index + 1}</span>
                  </div>
                  {playerId === UserDetails?.id && (
                    <Badge variant="outline">You</Badge>
                  )}
                </div>
              ))}

              {/* Show empty slots */}
              {Array.from({ length: maxPlayers - currentPlayerCount }).map(
                (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="flex items-center gap-3 p-2 opacity-50"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                        ?
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-400">
                      Waiting for player...
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            disabled={deleteRoom.isPending}
          >
            <X className="w-4 h-4 mr-2" />
            {deleteRoom.isPending ? "Leaving..." : "Leave Room"}
          </Button>
          <Button
            onClick={handleStart}
            className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            disabled={!roomDetails.roomCode || currentPlayerCount < 2}
          >
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoom;
