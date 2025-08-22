import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    playerName: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
    isWinner?: boolean | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    playerName: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
    isWinner?: boolean | null | undefined;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    playerName: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
    isWinner?: boolean | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    playerName: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
    isWinner?: boolean | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    playerName: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
    isWinner?: boolean | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    playerName: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
    isWinner?: boolean | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=playerStatusModel.d.ts.map