import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Secret key for JWT
const secretKey = process.env.SECRETKEY;

const authenticate = (req, res, next) => {
  const bearerHeader = req.header("Authorization");
  if (!bearerHeader) return res.status(401).json({ message: "Access denied" });

  try {
    const bearerToken = bearerHeader.split(" ")[1];
    console.log(bearerToken);
    jwt.verify(bearerToken, secretKey, (err, authData) => {
      if (err) {
        res.sendStatus(401).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN",
            },
          ],
        });
      } else {
        console.log(authData);
        req.user = authData;
        next();
      }
    });

    // next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authenticate;
