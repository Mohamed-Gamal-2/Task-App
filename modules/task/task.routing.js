//Imporing Third Party Module
import express from "express";

//import custom modules
import {
  addTask,
  updateTask,
  deleteTask,
  getTasks,
  dueTasks,
} from "./task.controller.js"; // Logic from Controller
import { validateBody, validateParams } from "../../middleware/validatoin.js"; // Validation middleware
import {
  addTaskValidation,
  updateTaskValidation,
  deleteTaskValidation,
} from "./tasks.validation.js"; //validion schemas

//Using only router from express
//to perform sub-routing
//and avoid 2 servers
const taskRouter = express.Router();

//Sub-Routing
taskRouter.post("/tasks/add", validateBody(addTaskValidation), addTask);
taskRouter.put("/tasks/update", validateBody(updateTaskValidation), updateTask);
taskRouter.delete(
  "/tasks/delete",
  validateBody(deleteTaskValidation),
  deleteTask
);
taskRouter.get("/tasks/all", getTasks);
taskRouter.get("/tasks/late", dueTasks);

//Exporting
export default taskRouter;
