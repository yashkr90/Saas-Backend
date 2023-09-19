import { Role } from "../../models/model.js";

export const getAll = async (req, res) => {
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
  };