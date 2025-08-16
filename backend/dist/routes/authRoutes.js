"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("@/auth/auth"));
const router = express_1.default.Router();
router.post("/auth/register", auth_1.default.register);
router.post("/auth/login", auth_1.default.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map