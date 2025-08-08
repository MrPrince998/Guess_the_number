import { Request, Response, NextFunction } from "express";
interface AuthRequest extends Request {
    userId?: string;
}
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => void | Response;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map