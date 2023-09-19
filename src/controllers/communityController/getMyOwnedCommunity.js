import { Community, Role, Member } from "../../models/model.js";

export const getMyOwnedCommunity = async (req, res) => {
    const { id } = req.user;
  
    try {
      const { page = 1, limit = 10 } = req.query;
  
      // Convert query parameters to integers for pagination
      const currentPage = parseInt(page);
      const pageLimit = parseInt(limit);
  
      const options = {
        page: currentPage,
        limit: pageLimit,
        select: "id name slug owner created_at updated_at", // Fields to select
      };
  
      const community = await Community.paginate({ owner: id }, options);
  
      if (!community) {
        return res.status(404).json({ message: "community not found" });
      }
      console.log(community);
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: community.totalDocs,
            pages: community.totalPages,
            page: community.page,
          },
          data: community.docs,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  };