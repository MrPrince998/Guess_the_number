import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    players: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: [
        {
          validator: function (v: any[]) {
            return v.length <= 2;
          },
          message: (props: any) =>
            `A maximum of 2 players is allowed. Received ${props.value.length}.`,
        },
        {
          validator: function (v: any[]) {
            const ids = v.map((player: any) => player.toString());
            return new Set(ids).size === ids.length;
          },
          message: "Duplicate players are not allowed.",
        },
      ],
    },
    isActiveRoom: {
      type: Boolean,
      default: false,
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    isGameStarted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.index({ roomCode: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);
