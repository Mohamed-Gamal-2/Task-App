//Import third party module
import mongoose from "mongoose";

//Creating userschema (no validateion, will be validated use Joi in middleware)
const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String, //toDo, Doing, Done
    userID: { type: mongoose.Types.ObjectId, ref: "User" },
    assignTo: { type: String },
    deadline: { type: Date, require: true },
    finished: Date,
  },
  { timestamps: true }
);

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
