import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }>;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }>;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }>;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
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
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }>;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }>;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: string;
    isPlayerJoined: boolean;
    role: "user" | "guest";
    lastSeen: NativeDate;
    isReady: boolean;
    hasTurn: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
    }>;
    currentGuess?: number | null | undefined;
    secretCode?: number | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=playerStatusModel.d.ts.map