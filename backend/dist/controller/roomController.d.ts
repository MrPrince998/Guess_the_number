import { Request, Response } from "express";
declare const _default: {
    createRoom: (req: Request, res: Response) => Promise<Response>;
    joinRoom: (req: Request, res: Response) => Promise<Response>;
    startGameRoom: (req: Request, res: Response) => Promise<Response>;
    exitRoom: (req: Request, res: Response) => Promise<Response>;
    playerReady: (req: Request, res: Response) => Promise<Response>;
    clearPlayerStatus: (req: Request, res: Response) => Promise<Response>;
    playerGuess: (req: Request, res: Response) => Promise<Response>;
    playersGuessHistory: (req: Request, res: Response) => Promise<Response>;
    getRoomStatus: (req: Request, res: Response) => Promise<Response>;
    setSecretCode: (req: Request, res: Response) => Promise<Response>;
    heartbeat: (req: Request, res: Response) => Promise<Response>;
};
export default _default;
//# sourceMappingURL=roomController.d.ts.map