import {
  BaseURL,
  getCurrentUser,
  getMySecretCode,
} from "@/components/constant/constant";
import SecretCode from "@/components/model/secretCode";
import { GetHook, PostHook } from "@/hook/apiCall";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { HeartBeatResponse, roomStatus } from "../main-menu/MainMenu";
import { motion } from "framer-motion";
import { Sword, Users, Clock, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import vaultImage from "@/assets/Lucid_Origin_Design_a_detailed_png_image_of_a_vault_with_a_met_0.jpg";
import RestartModel from "@/components/model/RestartModel";

interface playerStatus {
  id: string;
  playerId: string;
  currentGuess: number;
  guessHistory: number[];
}

interface playerGuessResponse {
  message: string;
  playerStatus: playerStatus;
  nextTurn: string;
}

interface playerGuessPayLoad {
  guess: string;
}

const GamePage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(true);
  const [roomStatus, setRoomStatus] = useState<roomStatus | null>(null);
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const { gameId } = useParams<{ gameId: string }>();

  const getRoomStatus = GetHook<roomStatus>(
    ["roomStatus"],
    gameId ? `${BaseURL}/api/room/rooms/${gameId}/status` : "",
    {
      enabled: !!gameId,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    }
  );

  const currentUserId = getCurrentUser()?.id ?? "";
  useEffect(() => {
    if (getRoomStatus.data) {
      setRoomStatus(getRoomStatus?.data);
      if (getRoomStatus.data.room?.isGameStarted) {
        setGameStarted(true);
      }
    }
  }, [getRoomStatus]);

  GetHook<HeartBeatResponse>(
    ["heartbeat", roomStatus?.room?.roomCode, currentUserId],
    roomStatus?.room?.roomCode && currentUserId
      ? `${BaseURL}/api/room/rooms/${gameId}/players/${currentUserId}/heartbeat`
      : "",
    {
      enabled: !!roomStatus?.room?.roomCode && !!currentUserId,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    }
  );

  const isReady = roomStatus?.players.some(
    (player) => player.id === currentUserId && player.isReady
  );

  const postGuess = PostHook<playerGuessResponse, playerGuessPayLoad>(
    "put",
    `${BaseURL}/api/room/rooms/${roomStatus?.room.roomCode}/players/${currentUserId}/guess`,
    ["player-guess"]
  );

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess) {
      toast.error("Please enter a number");
      return;
    }
    const numGuess = parseInt(guess);
    if (isNaN(numGuess)) {
      toast.error("Please enter a valid number");
      return;
    }
    postGuess.mutate(
      { guess: guess },
      {
        onSuccess: (data) => {
          console.log(data);
          getRoomStatus.refetch();
          setAttempts(attempts + 1);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to submit guess");
        },
      }
    );
    // Here you would typically send the guess to your backend
    setGuess("");
  };

  const currentPlayer = roomStatus?.players.find((p) => p.id === currentUserId);
  const opponent = roomStatus?.players.find((p) => p.id !== currentUserId);

  let playerAllGuessHistory = roomStatus?.room?.guessHistory?.sort(
    (a: any, b: any) => b.timestamp - a.timestamp
  );

  const mySecretCode = getMySecretCode();

  // const gameOver = roomStatus?.room.guessHistory.
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 p-4">
      {!isReady && (
        <SecretCode
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          roomStatus={roomStatus}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3   bg-indigo-100 rounded-lg text-indigo-600">
                <Sword className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-indigo-800">
                  Number Guessing Duel
                </h1>
                <p className="text-indigo-600">
                  {gameStarted ? "Game in progress" : "Waiting to start..."}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="px-4 py-2 border-indigo-300 bg-indigo-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Room: {roomStatus?.room?.roomCode || "Loading..."}
            </Badge>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Player Info */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              You
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-indigo-300">
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                  YOU
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {currentPlayer?.playerName || "Player 1"}
                </h3>
                <p className="text-sm text-gray-500">Attempts: {attempts}</p>
              </div>
            </div>

            {gameStarted && (
              <div className="space-y-4">
                <h3 className="font-medium text-indigo-700">{}</h3>
                <form onSubmit={handleGuessSubmit} className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                    placeholder="E.g: 1234"
                    disabled={!currentPlayer?.hasTurn}
                  />
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={!currentPlayer?.hasTurn}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Guess
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100 flex flex-col items-center justify-center">
            {!gameStarted ? (
              <div className="text-center space-y-4">
                <Clock className="w-12 h-12 mx-auto text-indigo-400" />
                <h3 className="text-xl font-semibold text-indigo-800">
                  Waiting for game to start
                </h3>
                <p className="text-indigo-600">
                  {roomStatus?.players.length === 2
                    ? "Both players ready!"
                    : "Waiting for opponent..."}
                </p>
                <Progress
                  value={roomStatus?.players.length === 2 ? 100 : 50}
                  className="h-2 bg-indigo-100"
                />
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div
                  className="w-32 h-32 rounded-full bg-cover bg-center mx-auto"
                  style={{
                    backgroundImage: `url(${vaultImage})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <h1 className="font-bold text-2xl mb-0">
                  Your Code - {mySecretCode || "N/A"}
                </h1>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-800">
                    Guess the secret number
                  </h3>
                  <p className="text-indigo-600">to Steal Opponent Gold</p>
                </div>
                <Badge className="px-4 py-2 bg-indigo-100 text-indigo-700">
                  <Trophy className="w-4 h-4 mr-2" />
                  Guess in Correct Order to Win!
                </Badge>
              </div>
            )}
          </div>

          {/* Opponent Info */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  opponent?.isReady ? "bg-green-500" : "bg-yellow-500"
                }`}
              ></span>
              Opponent
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-indigo-300">
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                  OPP
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {opponent ? `${opponent?.playerName}` : "Waiting..."}
                </h3>
                <p className="text-sm text-gray-500">
                  {opponent?.hasSecretCode ? "Ready" : "Not ready"}
                </p>
              </div>
            </div>

            {gameStarted && (
              <div className="space-y-4">
                <h3 className="font-medium text-indigo-700">
                  Opponent's Status
                </h3>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-indigo-600 text-sm">
                    {opponent ? "Guessing..." : "Disconnected"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Log */}
        {gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-xl shadow-md p-6 border border-indigo-100 overflow-hidden"
          >
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">
              Game Log
            </h2>
            <div className="space-y-2 max-h-50 overflow-y-scroll">
              {/* <div className="flex items-center justify-between p-2 bg-indigo-50 rounded">
                <span className="text-indigo-700">Game started!</span>
                <span className="text-xs text-indigo-500">Date</span>
              </div> */}
              {playerAllGuessHistory?.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-indigo-50 rounded"
                >
                  <span className="text-indigo-700">
                    {entry.playerId === currentUserId
                      ? "You guessed"
                      : "Opponent guessed"}{" "}
                    {entry.guess}
                  </span>
                  <span className="text-xs text-indigo-500">
                    {entry.result} -{" "}
                    <span className="text-green-500">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      {roomStatus?.room.winnerPlayerId && (
        <RestartModel roomStatus={roomStatus} currentUserId={currentUserId} />
      )}
    </div>
  );
};

export default GamePage;
