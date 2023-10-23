//Imporing Third Party Module
import express from "express";

//import custom modules
import {
  userSignUp,
  userVerify,
  userLogin,
  changePassword,
  updateUser,
  deleteUser,
  softDelete,
  userLogout,
  googleLogin,
} from "./user.controller.js"; //Logic from Controller
import { validateBody, validateParams } from "../../middleware/validatoin.js"; // Validation middleware
import {
  signupValidation,
  verificationValidation,
  loginValidation,
  changePasswordValidation,
  updateValidation,
} from "./user.validation.js"; // Joi Validation
import authentication from "../../middleware/authentication.js"; //authentecation
//Using only router from express
//to perform sub-routing
//and avoid 2 servers
const userRouter = express.Router();

//Routing
userRouter.post("/user/signup", validateBody(signupValidation), userSignUp);
userRouter.get(
  "/user/verify/:Email",
  validateParams(verificationValidation),
  userVerify
);
userRouter.post("/user/login", validateBody(loginValidation), userLogin);
userRouter.patch(
  "/user/updatePassword",
  [authentication, validateBody(changePasswordValidation)],
  changePassword
);
userRouter.patch(
  "/user/updateInfo",
  [authentication, validateBody(updateValidation)],
  updateUser
);
userRouter.delete("/user/delete", deleteUser);
userRouter.delete("/user/softdelete", softDelete);
userRouter.get("/user/logout", userLogout);
// byGoogle
userRouter.post("/googleLogin", googleLogin);

//Exporting
export default userRouter;
