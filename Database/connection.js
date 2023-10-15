//Importing Third Party module
import mongoose from "mongoose";

//Creating connection to database

const connection = () => {
  mongoose
    .connect("mongodb+srv://TaskApp:TaskApp@cluster0.hsndzrt.mongodb.net/")
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

//Exporting
export default connection;
