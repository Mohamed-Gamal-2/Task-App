//Import third party module
import Joi from "joi";

//validation
const addTaskValidation = Joi.object({
  title: Joi.string().min(5).max(25).required(),
  description: Joi.string().max(200).required(),
  status: Joi.string()
    .pattern(/(ToDo|Doing|Done)/)
    .required(),
  assignTo: Joi.string().required(),
  deadline: Joi.date().required(),
});
const updateTaskValidation = Joi.object({
  taskID: Joi.string().min(24).max(24).required(),
  title: Joi.string().min(5).max(25),
  description: Joi.string().max(200),
  status: Joi.string()
    .pattern(/(ToDo|Doing|Done)/)
    .required(),
  deadline: Joi.date(),
});
const deleteTaskValidation = Joi.object({
  taskID: Joi.string().min(24).max(24).required(),
});

//Exporting
export { addTaskValidation, updateTaskValidation, deleteTaskValidation };
