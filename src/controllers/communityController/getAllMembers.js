import { Community, Role, Member } from "../../models/model.js";

export const getAllMembers = async (req, res) => {
    console.log("get almem");
    const { id } = req.params;
  
    try {
      const { page = 1, limit = 10 } = req.query;
  
      // Convert query parameters to integers for pagination
      const currentPage = parseInt(page);
      const pageLimit = parseInt(limit);
  
      const community = await Community.find({ slug: id });
  
      console.log(community);
      const communityId = community[0]._id;
      console.log(communityId);
  
      // Create options for pagination
      const options = {
        page: currentPage,
        limit: pageLimit,
        select: "id community user role created_at", // Fields to select
        populate: [
          {
            path: "user",
            select: "id name", // Expand user field with id and name only
          },
          {
            path: "role",
            select: "id name", // Expand role field with id and name only
          },
        ],
      };
  
      const result = await Member.paginate({ community: communityId }, options);
      console.log(result);
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: result.totalDocs,
            pages: result.totalPages,
            page: result.page,
          },
          data: result.docs,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error: "Internal Server Error",
      });
    }
  };