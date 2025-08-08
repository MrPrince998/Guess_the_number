import mongoose from "mongoose";
declare const User: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    email: string;
    password: string;
    userLevel: number;
    userExperience: number;
    userCoin: number;
    userGamePlayed: number;
    userWinStreak: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    email: string;
    password: string;
    userLevel: number;
    userExperience: number;
    userCoin: number;
    userGamePlayed: number;
    userWinStreak: number;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    email: string;
    password: string;
    userLevel: number;
    userExperience: number;
    userCoin: number;
    userGamePlayed: number;
    userWinStreak: number;
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
    username: string;
    email: string;
    password: string;
    userLevel: number;
    userExperience: number;
    userCoin: number;
    userGamePlayed: number;
    userWinStreak: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    email: string;
    password: string;
    userLevel: number;
    userExperience: number;
    userCoin: number;
    userGamePlayed: number;
    userWinStreak: number;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    email: string;
    password: string;
    userLevel: number;
    userExperience: number;
    userCoin: number;
    userGamePlayed: number;
    userWinStreak: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default User;
//# sourceMappingURL=userModel.d.ts.map