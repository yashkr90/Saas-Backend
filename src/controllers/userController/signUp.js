import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../models/model.js";

dotenv.config();

const secretKey = process.env.SECRETKEY;

// SignUp handle controller
export const signUp = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(email);
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "email",
              message: "User with this email address already exists.",
              code: "RESOURCE_EXISTS",
            },
          ],
        });
      }
  
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save the new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
  
      const token = jwt.sign({ name: name, email: email }, secretKey);
  
      res.status(201).json({
        status: true,
        content: {
          data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            created_at: newUser.created_at,
          },
          meta: {
            access_token: token,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  };
  