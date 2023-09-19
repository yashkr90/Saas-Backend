import { Community, Role, Member } from "../../models/model.js";

export const getCommunity = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: { path: "owner", select: "id name" }, // Populate owner details
      };
  
      const communities = await Community.paginate({}, options);
  
      const data = communities.docs.map((role) => {
        return {
          id: role.id,
          name: role.name,
          slug: role.slug,
          owner: role.owner,
          created_at: role.created_at,
          updated_at: role.updated_at,
        };
      });
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: communities.totalDocs,
            pages: communities.totalPages,
            page: communities.page,
          },
          data: data,
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