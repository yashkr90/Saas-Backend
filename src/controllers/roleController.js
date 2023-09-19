import { Role } from "../models/model.js";

const createRole= async(req,res)=>{

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
}

const getAll=async(req,res)=>{

    try {
        const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
        const limit = parseInt(req.query.limit) || 10; // Set a default limit or get it from query parameters
    
        // Calculate the skip value to paginate the results
        const skip = (page - 1) * limit;
    
        // Fetch all roles from the database with pagination
        const roles = await Role.find().skip(skip).limit(limit);
    
        // Get the total number of roles (for pagination)
        const totalRoles = await Role.countDocuments();
    
        // Calculate the total number of pages
        const totalPages = Math.ceil(totalRoles / limit);
    
        const data = roles.map((role) => {
          return {
            id: role.id,
            name: role.name,
            created_at: role.created_at,
            updated_at: role.updated_at,
          };
        });
    
        // Send a JSON response with the roles and metadata
        res.status(200).json({
          status: true,
          content: {
            meta: {
              total: totalRoles,
              pages: totalPages,
              page: page,
            },
            data: data,
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          status: false,
          error: "Internal Server Error",
        });
      }
}

export {createRole, getAll}