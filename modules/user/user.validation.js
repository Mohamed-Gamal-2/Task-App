//Import third party module
import Joi from "joi";

const signupValidation = Joi.object({
  userName: Joi.string().min(3).max(25).required(),
  Email: Joi.string()
    .pattern(/^[a-z]+([a-z]|[0-9]|_|.)*@(gmail|yahoo|hotmail).com/)
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  age: Joi.number().min(12).max(75).required(),
  gender: Joi.string().required(),
  phone: Joi.string().pattern(/01(0|1|2|5)[0-9]{8}/),
});

const verificationValidation = Joi.object({
  Email: Joi.string()
    .pattern(/^[a-z]+([a-z]|[0-9]|_|.)*@(gmail|yahoo|hotmail).com/)
    .required(),
});

const loginValidation = Joi.object({
  Email: Joi.string()
    .pattern(/^[a-z]+([a-z]|[0-9]|_|.)*@(gmail|yahoo|hotmail).com/)
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
});

const changePasswordValidation = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  newPassword: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("newPassword")).required(),
});

const updateValidation = Joi.object({
  userName: Joi.string().min(3).max(25).required(),
  age: Joi.number().min(12).max(75).required(),
});

//Exporting
export {
  signupValidation,
  verificationValidation,
  loginValidation,
  changePasswordValidation,
  updateValidation,
};
