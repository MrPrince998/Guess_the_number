import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostHook, getErrorMessage } from "@/hook/apiCall";
import { Crown, Link, Swords, Zap } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CreateGameResponse {
  message: string;
  room: {
    id: string;
    roomCode: string;
    players: string[];
    isActiveRoom: boolean;
  };
  playerStatus: {
    id: string;
    playerId: string;
    isPlayerJoined: boolean;
    role: string;
  };
}

interface CreateGamePayload {
  userId: string;
}

const MainMenu = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<
    "first" | "second" | "third" | null
  >(null);

  // Get user ID from localStorage or context (replace with your auth logic)
  const getUserId = () => {
    // Replace this with your actual user ID retrieval logic
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return null;
    }
    // You might need to decode JWT or get from context
    return "your-actual-user-id"; // Replace with real user ID
  };

  const handleMaintainence = () => {
    toast.error("This feature is under maintenance.");
  };

  const { mutate, isPending, isError, data, error } = PostHook<
    CreateGameResponse,
    CreateGamePayload
  >("post", "/api/room/create", ["create-game"]);

  const handleCreateGame = () => {
    const userId = getUserId();
    if (!userId) return;

    mutate(
      { userId },
      {
        onSuccess: (data) => {
          toast.success(`Room created! Code: ${data.room.roomCode}`);
          setOpenDialog(null); // Close dialog
          // Navigate to the created room
          navigate(`/room/${data.room.roomCode}`);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  return (
    <div className="bg-background min-h-screen w-full px-8 flex items-top justify-center">
      <div className="flex flex-col items-center w-full max-w-2xl px-4 py-12">
        <h1 className="text-primary font-bold text-4xl my-8">
          GUESS THE NUMBER
        </h1>
        <div className="flex flex-col items-center space-y-4 max-w-sm w-full p-6 bg-white rounded-3xl shadow-lg">
          <Dialog
            open={openDialog === "first"}
            onOpenChange={(open) => setOpenDialog(open ? "first" : null)}
          >
            <DialogTrigger className="w-full">
              <Button
                variant="ghost"
                className="w-full py-4 text-secondary font-bold text-lg"
                onClick={() => setOpenDialog("first")}
              >
                Play Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogDescription className="flex flex-col items-center gap-4 py-4">
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
                    setOpenDialog(null);
                    navigate("/join-room");
                  }}
                >
                  <Link className="mr-2" />
                  Join Game
                </Button>
              </DialogDescription>
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDialog === "second"}
            onOpenChange={(open) => setOpenDialog(open ? "second" : null)}
          >
            <DialogTrigger className="w-full">
              <Button
                variant="ghost"
                className="w-full py-4 text-secondary font-bold text-lg"
                onClick={() => setOpenDialog("second")}
              >
                How to Play
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogDescription>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-4">How to Play</h2>
                  <div className="space-y-2 text-sm">
                    <p>1. Create or join a room with another player</p>
                    <p>2. Set your secret 4-digit number</p>
                    <p>3. Take turns guessing each other's number</p>
                    <p>4. First to guess correctly wins!</p>
                  </div>
                </div>
              </DialogDescription>
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
    </div>
  );
};

export default MainMenu;
