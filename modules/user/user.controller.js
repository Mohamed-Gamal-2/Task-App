//Importing Custom Modules
import userModel from "../../Database/models/user.model.js/user.model.js";
import { verification } from "../../utilities/Verfication.js";

// google-auth-library
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(
  "336014810709-n50q2ohjhitbi1a15iu14jhvtkqqp3ru.apps.googleusercontent.com"
);

//Importing third party modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

//Logic
//----------Signup----------------
const userSignUp = async (req, res) => {
  try {
    const { Email, password } = req.body;
    const matchedUser = await userModel.findOne({ Email: Email });
    if (matchedUser)
      res.status(409).json({ Message: "User is already signed up" });
    else {
      const securedPassword = bcrypt.hashSync(password, 5);
      const addeUser = await userModel.insertMany({
        ...req.body,
        password: securedPassword,
        isVerified: false,
        isDeleted: false,
      });
      verification(Email);
      res
        .status(201)
        .json({ Message: "Signed up, Please verify your Email", addeUser });
    }
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};
//----------Verifications----------------
const userVerify = async (req, res) => {
  try {
    const { Email } = req.params;
    const matchedUser = await userModel.findOne({
      Email: Email,
    });
    if (matchedUser) {
      if (matchedUser.isVerified == false) {
        await userModel.updateOne(
          {
            Email: Email,
          },
          { isVerified: true }
        );
        res.status(200).json({ Message: "Your Email is now verified" });
      } else
        res.status(409).json({ Message: "Your Email is already verified" });
    } else
      res
        .status(404)
        .json({ Message: "You need to signup first 'Email not found'" });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------Login----------------
const userLogin = async (req, res) => {
  const { Email, password } = req.body;

  //if isDeleted will not be able to do anth
  const matchedUser = await userModel.findOne({
    Email: Email,
    isDeleted: false,
  });
  if (matchedUser) {
    if (matchedUser.isVerified == true) {
      const comparePassword = bcrypt.compareSync(
        password,
        matchedUser.password
      );
      if (comparePassword) {
        await userModel.updateOne({ Email: Email }, { isLoggedin: true });
        const token = jwt.sign(
          {
            payload: {
              userName: matchedUser.userName,
              Email: matchedUser.Email,
              ID: matchedUser._id,
              isLoggedin: matchedUser.isLoggedin,
            },
          },
          "AppTaskSecret"
        );

        res.status(200).json({ Message: "welcome back", token: token });
      } else res.status(409).json({ Message: "incorrect Password" });
    } else
      res
        .status(400)
        .json({ Message: "Verify your Email first,Please check your inbox" });
  } else
    res
      .status(404)
      .json({ Message: "You need to signup first 'Email not found'" });
  try {
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------Change Password----------------
const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const { token } = req.headers;
  const tokenFlag = jwt.verify(token, "AppTaskSecret");
  const matchedUser = await userModel.findOne({
    _id: tokenFlag.payload.ID,
    isLoggedin: true,
  });
  if (matchedUser) {
    const comparePassword = bcrypt.compareSync(password, matchedUser.password);
    if (comparePassword) {
      const updateUser = await userModel.updateOne(
        {
          _id: tokenFlag.payload.ID,
        },
        { password: bcrypt.hashSync(newPassword, 5) }
      );
      res.status(200).json({ Message: "Password Changed successfully" });
    } else res.status(409).json({ Message: "incorrect Password" });
  } else res.status(409).json({ Message: "You need to sign in" });
  try {
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------Update user----------------
const updateUser = async (req, res) => {
  try {
    const { userName, age } = req.body;
    const { token } = req.headers;
    const tokenFlag = jwt.verify(token, "AppTaskSecret");
    const matchedUser = await userModel.findOne({
      _id: tokenFlag.payload.ID,
      isLoggedin: true,
    });
    if (matchedUser) {
      const updateUser = await userModel.updateOne(
        {
          _id: tokenFlag.payload.ID,
        },
        { userName: userName, age: age }
      );
      res.status(200).json({ Message: "User Data updated successfully" });
    } else res.status(401).json({ Message: "You need to sign in" });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------delete user----------------
const deleteUser = async (req, res) => {
  try {
    const { token } = req.headers;
    const tokenFlag = jwt.verify(token, "AppTaskSecret");
    const matchedUser = await userModel.findOne({
      _id: tokenFlag.payload.ID,
      isLoggedin: true,
    });
    if (matchedUser) {
      await userModel.findByIdAndDelete({ _id: tokenFlag.payload.ID });
      res.status(200).json({ Message: "User deleted" });
    } else res.status(401).json({ Message: "You need to sign in" });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------Soft delete----------------
const softDelete = async (req, res) => {
  try {
    const { token } = req.headers;
    const tokenFlag = jwt.verify(token, "AppTaskSecret");
    const matchedUser = await userModel.findOne({
      _id: tokenFlag.payload.ID,
      isDeleted: false,
      isLoggedin: true,
    });
    if (matchedUser) {
      await userModel.findByIdAndUpdate(
        { _id: tokenFlag.payload.ID },
        { isDeleted: true, isLoggedin: false }
      );
      res.status(200).json({ Message: "User soft deleted" });
    } else res.status(401).json({ Message: "You need to sign in" });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

//----------logout----------------
const userLogout = async (req, res) => {
  try {
    const { token } = req.headers;
    const tokenFlag = jwt.verify(token, "AppTaskSecret");
    const matchedUser = await userModel.findOne({
      _id: tokenFlag.payload.ID,
      isLoggedin: true,
    });
    if (matchedUser) {
      await userModel.findByIdAndUpdate(
        { _id: tokenFlag.payload.ID },
        { isLoggedin: false }
      );
      res.status(200).json({ Message: "logged out" });
    } else res.status(401).json({ Message: "You need to sign in" });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};
//----------ByGoogle----------------
const googleLogin = async function (req, res) {
  // const { tokenId, googleId } = req.body;
  try {
    let { userName, Email, password, age, gander, isVerified } = req.body;
    const user = await userModel.findOne({ Email });
    if (user) {
      //----------------------------------------

      const token = jwt.sign(
        {
          payload: {
            userName,
            Email,
            ID: user._id,
            isLoggedin: true,
          },
        },
        "AppTaskSecret"
      );

      res.status(200).json({
        Message: "welcome back",
        token,
        data: { _id: user._id, email: user.Email },
      });
      //----------------------------------------
    } else {
      const savedUser = await userModel.insertOne({
        userName,
        Email,
        age,
        gander,
        isVerified: true,
        password: nanoid(),
      });
      const token = jwt.sign(
        {
          payload: {
            userName,
            Email,
            ID: savedUser._id,
            isLoggedin: true,
          },
        },
        "AppTaskSecret"
      );

      res.status(200).json({
        Message: "welcome back",
        token,
        data: { _id: savedUser._id, email: savedUser.Email },
      });
    }
  } catch (error) {
    res.json({ Messagess: error });
  }
};
//----------ByGoogle----------------

//Export
export {
  userSignUp,
  userVerify,
  userLogin,
  changePassword,
  updateUser,
  deleteUser,
  softDelete,
  userLogout,
  googleLogin,
};
