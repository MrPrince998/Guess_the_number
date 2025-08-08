import { Request, Response } from "express";
declare const authController: {
    register: (req: Request, res: Response) => Promise<Response | void>;
    login: (req: Request, res: Response) => Promise<Response | void>;
};
export default authController;
//# sourceMappingURL=auth.d.ts.map