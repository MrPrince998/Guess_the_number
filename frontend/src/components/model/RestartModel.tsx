import type { roomStatus } from "@/pages/main-menu/MainMenu";
import { Button } from "../ui/button";

interface RestartModelProps {
  roomStatus?: roomStatus | null;
  currentUserId: string;
}

const RestartModel = ({ roomStatus, currentUserId }: RestartModelProps) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white/80 rounded-lg shadow-lg p-4 border border-indigo-100 w-full h-full flex flex-col justify-center items-center">
      <>
        <h2 className="text-lg font-semibold text-indigo-800 mb-2">
          Game Over!
        </h2>
        <p className="text-indigo-600">
          {roomStatus?.room.winnerPlayerId === currentUserId
            ? "Congratulations! You won!"
            : "Your opponent won. Better luck next time!"}
        </p>
        <Button
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => {
            // Logic to reset the game or navigate back to main menu
            window.location.href = "/";
          }}
        >
          Back to Main Menu
        </Button>
      </>
    </div>
  );
};

export default RestartModel;
