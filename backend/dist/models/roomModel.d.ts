import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    players: string[];
    roomCreator: string;
    isActiveRoom: boolean;
    roomCode: string;
    isGameStarted: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }>;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    players: string[];
    roomCreator: string;
    isActiveRoom: boolean;
    roomCode: string;
    isGameStarted: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }>;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    players: string[];
    roomCreator: string;
    isActiveRoom: boolean;
    roomCode: string;
    isGameStarted: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }>;
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
    players: string[];
    roomCreator: string;
    isActiveRoom: boolean;
    roomCode: string;
    isGameStarted: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }>;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    players: string[];
    roomCreator: string;
    isActiveRoom: boolean;
    roomCode: string;
    isGameStarted: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }>;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    players: string[];
    roomCreator: string;
    isActiveRoom: boolean;
    roomCode: string;
    isGameStarted: boolean;
    guessHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }> & {
        timestamp: NativeDate;
        guess?: number | null | undefined;
        result?: string | null | undefined;
        playerId?: string | null | undefined;
    }>;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=roomModel.d.ts.map