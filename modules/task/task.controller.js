//Importing Custom Modules
import taskModel from "../../Database/models/task.model.js/task.model.js";
import userModel from "../../Database/models/user.model.js/user.model.js";

//importing third party module
import jwt from "jsonwebtoken";

//Logic
//----------Add task and status----------------
const addTask = async (req, res) => {
  try {
    const { token } = req.headers;
    const tokenFlag = jwt.verify(token, "AppTaskSecret");
    const user = await userModel.findOne({ _id: tokenFlag.payload.ID });
    if (user.isLoggedin) {
      const userid = tokenFlag.payload.ID;
      const addedTask = await taskModel.insertMany({
        ...req.body,
        userID: userid,
      });
      await userModel.updateOne(
        { _id: userid },
        { $push: { tasksAdded: addedTask[0]._id } }
      );
      await userModel.updateOne(
        { _id: req.body.assignTo },
        { $push: { tasksAssigned: addedTask[0]._id } }
      );
      res
        .status(201)
        .json({ Message: "Task has been added successfully", addedTask });
    } else res.status(400).json({ Message: "Please sign in" });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------Update task----------------
const updateTask = async (req, res) => {
  try {
    const { taskID, status } = req.body;
    const { token } = req.headers;
    const tokenFlag = jwt.verify(token, "AppTaskSecret");
    const user = await userModel.findOne({ _id: tokenFlag.payload.ID });
    if (user.isLoggedin) {
      const userid = tokenFlag.payload.ID;
      const requiredTask = await taskModel.findById(taskID);
      if (requiredTask) {
        if (requiredTask.userID == userid) {
          if (status !== "Done") {
            const requiredTaskUpdata = await taskModel.updateOne(
              { _id: taskID },
              {
                ...req.body,
              }
            );
            res.status(201).json({
              Message: "Task has been updated successfully",
              requiredTaskUpdata,
            });
          } else {
            const doneAt = await taskModel.findById(taskID);
            const requiredTaskUpdata = await taskModel.updateOne(
              { _id: taskID },
              {
                ...req.body,
                finished: doneAt.updatedAt,
              }
            );
            res.status(201).json({
              Message: "Task has been updated successfully",
              requiredTaskUpdata,
            });
          }
        } else res.status(400).json({ Message: "You cannot edit this task" });
      } else res.status(404).json({ Message: "No such task" });
    } else res.status(400).json({ Message: "Please sign in" });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------Delete task---------------
const deleteTask = async (req, res) => {
  try {
    const { taskID } = req.body;
    const { token } = req.headers;
    const tokenFlag = jwt.verify(token, "AppTaskSecret");
    const user = await userModel.findOne({ _id: tokenFlag.payload.ID });
    if (user.isLoggedin) {
      const userid = tokenFlag.payload.ID;
      const requiredTask = await taskModel.findById(taskID);
      if (requiredTask) {
        if (requiredTask.userID == userid) {
          console.log(requiredTask.userID);
          console.log(userid);
          await taskModel.findByIdAndDelete({
            _id: taskID,
          });
          const creators = await userModel.updateMany(
            {
              tasksAdded: { $elemMatch: { $eq: taskID } },
            },
            { $pull: { tasksAdded: { $eq: taskID } } }
          );
          const workers = await userModel.updateMany(
            {
              tasksAssigned: { $elemMatch: { $eq: taskID } },
            },
            { $pull: { tasksAssigned: { $eq: taskID } } }
          );
          res.status(200).json({
            Message: "Task deleted",
          });
        } else res.status(400).json({ Message: "You cannot delete this task" });
      } else res.status(404).json({ Message: "No such task" });
    } else res.status(400).json({ Message: "Please sign in" });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------Get tasks---------------
const getTasks = async (req, res) => {
  try {
    const alltasks = await taskModel
      .find()
      .populate("userID")
      .populate("assignTo");
    res.status(200).json({ Message: "All tasks available", alltasks });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};
//----------Due tasks---------------
const dueTasks = async (req, res) => {
  const dueTasksArr = [];
  try {
    const alltasks = await taskModel.find();
    for (const task of alltasks) {
      if (task.finished > task.deadline) dueTasksArr.push(task);
    }
    res.status(400).json({ Message: "All late tasks", dueTasksArr });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

export { addTask, updateTask, deleteTask, getTasks, dueTasks };
