import { BaseURL, UserDetails } from "@/components/constant/constant";
import { GetHook } from "@/hook/apiCall";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {
  HeartBeatResponse,
  RoomDetails,
  roomStatus,
} from "../main-menu/MainMenu";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Users,
  Clock,
  Trophy,
  Zap,
  Sword,
  Shield,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import SecretCode from "@/components/model/secretCode";

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [roomStatus, setRoomStatus] = useState<roomStatus | null>(null);
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [playerSecret, setPlayerSecret] = useState<number | null>(null);
  const [opponentSecret, setOpponentSecret] = useState<number | null>(null);
  const [gameLog, setGameLog] = useState<
    Array<{
      player: string;
      guess: number;
      result: string;
      timestamp: Date;
    }>
  >([]);

  // Mock function to set secret code (replace with your actual implementation)
  const setSecretCode = (code: number) => {
    setPlayerSecret(code);
    toast.success(`Your secret number (${code}) is locked in!`);
  };

  // Mock function to simulate opponent setting their code
  useEffect(() => {
    if (gameStarted && playerSecret) {
      const timer = setTimeout(() => {
        const opponentCode = Math.floor(Math.random() * 100) + 1;
        setOpponentSecret(opponentCode);
        addToGameLog("opponent", `Opponent has set their secret number`, null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, playerSecret]);

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

  useEffect(() => {
    if (getRoomStatus.data) {
      setRoomStatus(getRoomStatus?.data);
      if (getRoomStatus.data.room?.isGameStarted) {
        setGameStarted(true);
      }
    }
  }, [getRoomStatus]);

  const playerHearbeat = GetHook<HeartBeatResponse>(
    ["heartbeat", roomStatus?.room?.roomCode, UserDetails.id],
    roomStatus?.room?.roomCode && UserDetails.id
      ? `${BaseURL}/api/room/rooms/${gameId}/players/${UserDetails.id}/heartbeat`
      : "",
    {
      enabled: !!roomStatus?.room?.roomCode && !!UserDetails.id,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    }
  );

  const currentPlayer = roomStatus?.players.find(
    (p) => p.id === UserDetails.id
  );
  const opponent = roomStatus?.players.find((p) => p.id !== UserDetails.id);

  const addToGameLog = (
    player: string,
    message: string,
    guess: number | null
  ) => {
    setGameLog((prev) => [
      {
        player,
        guess: guess || 0,
        result: message,
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

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

    // Game logic would go here - this is mock implementation
    setAttempts(attempts + 1);
    addToGameLog("player", `You guessed ${numGuess}`, numGuess);

    if (opponentSecret) {
      if (numGuess === opponentSecret) {
        addToGameLog("system", `You cracked the code!`, null);
        toast.success("You won! You guessed the opponent's number!");
      } else if (numGuess < opponentSecret) {
        addToGameLog("system", `Your guess was too low`, null);
        toast("Your guess was too low", { icon: "⬆️" });
      } else {
        addToGameLog("system", `Your guess was too high`, null);
        toast("Your guess was too high", { icon: "⬇️" });
      }
    }

    setGuess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <Sword className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-800">
                  Code Breaker Duel
                </h1>
                <p className="text-blue-600">
                  {gameStarted
                    ? "Game in progress"
                    : opponent
                    ? "Waiting for codes to be set..."
                    : "Waiting for opponent..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="px-4 py-2 border-blue-300 bg-blue-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Room: {roomStatus?.room?.roomCode || "Loading..."}
              </Badge>
              <Badge className="px-4 py-2 bg-blue-100 text-blue-700">
                <Trophy className="w-4 h-4 mr-2" />
                Attempts: {attempts}
              </Badge>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Vault */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-blue-300">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    YOU
                  </AvatarFallback>
                </Avatar>
                Your Vault
              </h2>
              {playerSecret ? (
                <Badge className="bg-green-100 text-green-800">
                  <Lock className="w-4 h-4 mr-1" />
                  Code Locked
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Unlock className="w-4 h-4 mr-1" />
                  Set Your Code
                </Badge>
              )}
            </div>

            {!playerSecret ? (
              <div className="space-y-4">
                <p className="text-blue-600">Set your secret number (1-100):</p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="w-full p-3 border border-blue-200 rounded-lg"
                    placeholder="1-100"
                  />
                  <Button
                    onClick={() => {
                      const num = parseInt(guess);
                      if (!isNaN(num) && num >= 1 && num <= 100) {
                        setSecretCode(num);
                        addToGameLog(
                          "player",
                          `You set your secret number`,
                          num
                        );
                      } else {
                        toast.error("Please enter a number between 1-100");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Lock It
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center justify-center py-4"
              >
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-300 shadow-inner">
                    <span className="text-3xl font-bold text-blue-700">
                      {playerSecret}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 p-2 bg-blue-600 rounded-full">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="mt-4 text-blue-600 text-center">
                  Your secret number is protected
                </p>
              </motion.div>
            )}
          </div>

          {/* Game Board */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200 flex flex-col">
            <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Code Breaking Arena
            </h2>

            {!gameStarted || !playerSecret || !opponentSecret ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <Clock className="w-12 h-12 mx-auto text-blue-400" />
                <h3 className="text-xl font-semibold text-blue-800">
                  {!opponent
                    ? "Waiting for opponent..."
                    : !playerSecret
                    ? "Set your secret number"
                    : "Waiting for opponent to set their number"}
                </h3>
                <Progress
                  value={
                    !opponent
                      ? 25
                      : !playerSecret
                      ? 50
                      : !opponentSecret
                      ? 75
                      : 100
                  }
                  className="h-2 w-full bg-blue-100"
                  indicatorClassName="bg-blue-500"
                />
              </div>
            ) : (
              <div className="flex-1 space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-700 text-center">
                    Guess your opponent's secret number between 1-100
                  </p>
                </div>

                <form onSubmit={handleGuessSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                      placeholder="Enter your guess"
                    />
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Submit Guess
                    </Button>
                  </div>
                </form>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between text-sm text-blue-700">
                    <span>Your attempts: {attempts}</span>
                    <span>Opponent's attempts: 0</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Opponent Vault */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-blue-300">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {opponent ? "OPP" : "?"}
                  </AvatarFallback>
                </Avatar>
                {opponent ? "Opponent's Vault" : "Waiting..."}
              </h2>
              {opponentSecret ? (
                <Badge className="bg-green-100 text-green-800">
                  <Lock className="w-4 h-4 mr-1" />
                  Code Locked
                </Badge>
              ) : opponent ? (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Unlock className="w-4 h-4 mr-1" />
                  Setting Code
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">
                  <Users className="w-4 h-4 mr-1" />
                  Waiting
                </Badge>
              )}
            </div>

            {!opponent ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <Users className="w-10 h-10 text-gray-400" />
                <p className="text-gray-500">Waiting for opponent to join</p>
              </div>
            ) : !opponentSecret ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center border-4 border-dashed border-blue-200">
                    <span className="text-3xl font-bold text-blue-300">?</span>
                  </div>
                  <div className="absolute -top-2 -right-2 p-2 bg-blue-200 rounded-full">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="mt-4 text-blue-600">
                  Opponent is setting their secret number
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center justify-center py-4"
              >
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-300 shadow-inner">
                    <span className="text-3xl font-bold text-blue-700">?</span>
                  </div>
                  <div className="absolute -top-2 -right-2 p-2 bg-blue-600 rounded-full">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="mt-4 text-blue-600 text-center">
                  Crack the code to win!
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Game Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
              <ScrollText className="w-5 h-5" />
              Game Log
            </h2>
            <Badge variant="outline" className="border-blue-200">
              {new Date().toLocaleTimeString()}
            </Badge>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            <AnimatePresence>
              {gameLog.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-400"
                >
                  Game log will appear here
                </motion.div>
              ) : (
                gameLog.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg ${
                      log.player === "player"
                        ? "bg-blue-50 border border-blue-100"
                        : log.player === "opponent"
                        ? "bg-purple-50 border border-purple-100"
                        : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-1 rounded ${
                          log.player === "player"
                            ? "bg-blue-100 text-blue-600"
                            : log.player === "opponent"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {log.player === "player" ? (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              Y
                            </AvatarFallback>
                          </Avatar>
                        ) : log.player === "opponent" ? (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                              O
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                              S
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {log.player === "player"
                            ? "You"
                            : log.player === "opponent"
                            ? "Opponent"
                            : "System"}
                          {log.guess > 0 && ` guessed ${log.guess}`}
                        </div>
                        <div className="text-xs text-gray-600">
                          {log.result}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {log.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePage;
