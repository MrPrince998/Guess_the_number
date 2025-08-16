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
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    players: string[];
    roomCreator: string;
    isActiveRoom: boolean;
    roomCode: string;
    isGameStarted: boolean;
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
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    players: string[];
    roomCreator: string;
    isActiveRoom: boolean;
    roomCode: string;
    isGameStarted: boolean;
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
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=roomModel.d.ts.map