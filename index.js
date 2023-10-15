//Importing Third Party modules
import express from "express";
//Importing Custom module
import userRouter from "./modules/user/user.routing.js"; //User routing module
import taskRouter from "./modules/task/task.routing.js"; //Task routing module
import connection from "./Database/connection.js"; //Database Connection

//Starting a new server
const server = express();
//Starting database
connection();
//Middleware
server.use(express.json()); //Parse data(chunck) from request body
server.use(userRouter); // Sub-routing to user-control
server.use(taskRouter); //Sub-routing to task-control

//Choosing the port
server.listen(8000, () => {
  console.log("Server Started");
});
