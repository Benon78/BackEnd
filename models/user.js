/** @format */

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password :{
        type: String,
        required: true,
    },
    role : {
        type: String,
        enum : ['user', 'admin'],
        default: 'user'
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
