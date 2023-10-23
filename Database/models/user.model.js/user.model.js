//Import third party module
import mongoose from "mongoose";

//Creating userschema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      unique: true,
    },
    Email: {
      type: String,
      require: true,
      unique: true,
    },
    password: String,
    age: Number,
    gender: String,
    phone: String,
    isVerified: Boolean,
    isDeleted: Boolean,
    tasksAdded: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
    tasksAssigned: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
    isLoggedin: Boolean,
    googleId: String,
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
