import { Role } from "../../models/model.js";

export const createRole = async (req, res) => {
    try {
      const { name } = req.body;
  
      // Check if a role with the same name already exists
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({
          status: false,
          error: "Role with this name already exists.",
        });
      }
  
      // Create a new role
      const role = new Role({
        name,
      });
  
      // Save the role to the database
      await role.save();
  
      res.status(201).json({
        status: true,
        content: {
          data: {
            id: role.id,
            name: role.name,
            created_at: role.created_at,
            updated_at: role.updated_at,
          },
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error: "Internal Server Error",
      });
    }
  };