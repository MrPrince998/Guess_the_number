import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { PostHook } from "@/hook/apiCall";
import { BaseURL, getCurrentUser } from "../constant/constant";
import toast from "react-hot-toast";
import type { roomStatus } from "@/pages/main-menu/MainMenu";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, Zap } from "lucide-react";

interface SecretCodeProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  roomStatus?: roomStatus | null;
}

interface setCodeResponse {
  message: string;
  playerStatus: {
    id: string;
    playerId: string;
    hasSecretCode: boolean;
  };
}

const SecretCode = ({
  openDialog,
  setOpenDialog,
  roomStatus,
}: SecretCodeProps) => {
  const [secretCode, setSecretCode] = useState<string>("");
  const [shake, setShake] = useState(false);
  const currentUserId = getCurrentUser()?.id ?? "";

  const secretCodeAPI = PostHook<setCodeResponse, { secretCode: string }>(
    "patch",
    roomStatus?.room?.roomCode && currentUserId
      ? `${BaseURL}/api/room/rooms/${roomStatus.room.roomCode}/players/${currentUserId}/secret`
      : "",
    ["set-secret-code"]
  );

  const isLoading = secretCodeAPI.isPending;

  const handleSetSecretCode = () => {
    if (secretCode.length !== 4) {
      toast.error("Code must be 4 digits");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    secretCodeAPI.mutate(
      { secretCode },
      {
        onSuccess: (data) => {
          localStorage.setItem("mySecretCode", secretCode);
          toast.success(data.message);
          setOpenDialog(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to set code");
        },
      }
    );
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[425px] rounded-lg bg-gradient-to-b from-blue-50 to-indigo-50 border-0 shadow-xl">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-indigo-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <DialogTitle className="font-bold text-2xl text-indigo-800">
              Set Your Secret Code
            </DialogTitle>
            <p className="text-sm text-indigo-600 mt-2">
              Choose a 4-digit number your opponent will try to guess
            </p>
          </div>
        </DialogHeader>

        <motion.div
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <InputOTP
            maxLength={4}
            value={secretCode}
            onChange={(value) => {
              if (/^\d*$/.test(value)) {
                setSecretCode(value);
              }
            }}
          >
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-14 w-14 text-xl border-indigo-300 bg-white rounded-lg shadow-sm"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <div className="w-full flex flex-col gap-2">
            <Button
              onClick={handleSetSecretCode}
              disabled={isLoading}
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold"
            >
              {isLoading ? (
                "Securing Code..."
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Lock In Code
                </>
              )}
            </Button>

            <AnimatePresence>
              {secretCode.length === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-indigo-500 flex items-center justify-center gap-1"
                >
                  <Zap className="w-4 h-4" />
                  Ready to duel with code: {secretCode}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SecretCode;
