import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../models/model.js";

dotenv.config();



// get me
export const getMe = async (req, res) => {
    const { email, id } = req.user;
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
  
      res.status(200).json({
        status: true,
        content: {
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  };
  