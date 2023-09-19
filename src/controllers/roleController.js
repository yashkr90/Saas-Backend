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

      const { page = 1, limit = 10 } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        
      };
     

        const roles = await Role.paginate({}, options);
    
       
    
        const data = roles.docs.map((role) => {
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
              total: roles.totalDocs,
              pages: roles.totalPages,
              page: roles.page,
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