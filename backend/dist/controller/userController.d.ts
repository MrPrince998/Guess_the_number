import { Request, Response } from "express";
interface AuthRequest extends Request {
    userId?: string;
}
declare const _default: {
    getMyProfile: (req: AuthRequest, res: Response) => Promise<Response | void>;
};
export default _default;
//# sourceMappingURL=userController.d.ts.map