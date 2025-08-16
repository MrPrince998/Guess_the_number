"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const roomSchema = new mongoose_1.Schema({
    players: {
        type: [
            {
                type: String,
                required: true,
            },
        ],
        validate: [
            {
                validator: function (v) {
                    return v.length <= 2;
                },
                message: (props) => `A maximum of 2 players is allowed. Received ${props.value.length}.`,
            },
            {
                validator: function (v) {
                    const ids = v.map((player) => player.toString());
                    return new Set(ids).size === ids.length;
                },
                message: "Duplicate players are not allowed.",
            },
        ],
    },
    roomCreator: {
        type: String,
        required: true,
    },
    isActiveRoom: {
        type: Boolean,
        default: false,
    },
    roomCode: {
        type: String,
        required: true,
    },
    isGameStarted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
roomSchema.index({ roomCode: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Room", roomSchema);
//# sourceMappingURL=roomModel.js.map