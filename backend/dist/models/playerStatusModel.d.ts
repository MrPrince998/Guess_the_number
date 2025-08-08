import mongoose from "mongoose";
declare const PlayerStatus: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: mongoose.Types.ObjectId;
    isPlayerJoined: boolean;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess: number;
    guessHistory: mongoose.Types.DocumentArray<{
        guess: number;
        result: string;
        time: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        guess: number;
        result: string;
        time: NativeDate;
    }> & {
        guess: number;
        result: string;
        time: NativeDate;
    }>;
    secretCode?: number | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: mongoose.Types.ObjectId;
    isPlayerJoined: boolean;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess: number;
    guessHistory: mongoose.Types.DocumentArray<{
        guess: number;
        result: string;
        time: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        guess: number;
        result: string;
        time: NativeDate;
    }> & {
        guess: number;
        result: string;
        time: NativeDate;
    }>;
    secretCode?: number | null | undefined;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: mongoose.Types.ObjectId;
    isPlayerJoined: boolean;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess: number;
    guessHistory: mongoose.Types.DocumentArray<{
        guess: number;
        result: string;
        time: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        guess: number;
        result: string;
        time: NativeDate;
    }> & {
        guess: number;
        result: string;
        time: NativeDate;
    }>;
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
    playerId: mongoose.Types.ObjectId;
    isPlayerJoined: boolean;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess: number;
    guessHistory: mongoose.Types.DocumentArray<{
        guess: number;
        result: string;
        time: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        guess: number;
        result: string;
        time: NativeDate;
    }> & {
        guess: number;
        result: string;
        time: NativeDate;
    }>;
    secretCode?: number | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: mongoose.Types.ObjectId;
    isPlayerJoined: boolean;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess: number;
    guessHistory: mongoose.Types.DocumentArray<{
        guess: number;
        result: string;
        time: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        guess: number;
        result: string;
        time: NativeDate;
    }> & {
        guess: number;
        result: string;
        time: NativeDate;
    }>;
    secretCode?: number | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomCode: string;
    playerId: mongoose.Types.ObjectId;
    isPlayerJoined: boolean;
    isReady: boolean;
    hasTurn: boolean;
    currentGuess: number;
    guessHistory: mongoose.Types.DocumentArray<{
        guess: number;
        result: string;
        time: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        guess: number;
        result: string;
        time: NativeDate;
    }> & {
        guess: number;
        result: string;
        time: NativeDate;
    }>;
    secretCode?: number | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default PlayerStatus;
//# sourceMappingURL=playerStatusModel.d.ts.map