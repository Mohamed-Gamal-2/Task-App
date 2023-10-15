//Importing third party modules
import jwt from "jsonwebtoken";

//Authentications
const authentication = (req, res, next) => {
  const { token } = req.headers;
  if (token) {
    try {
      const tokenFlag = jwt.verify(token, "AppTaskSecret");
      if (tokenFlag) next();
    } catch (err) {
      res.status(400).json({ Message: "Invalid token" });
    }
  } else res.status(401).json({ Message: "Unauthorized, Please login" });
};

//exporting
export default authentication;
