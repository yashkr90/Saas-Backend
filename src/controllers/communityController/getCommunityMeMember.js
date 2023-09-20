import { Community, Role, Member } from "../../models/model.js";

export const getCommunityMeMember = async (req, res) => {
    try {
      const userId = req.user.id; // currently authenticated user's ID from the token
      const { page = 1, limit = 10 } = req.query;
  
      // Convert query parameters to integers for pagination
      const currentPage = parseInt(page);
      const pageLimit = parseInt(limit);
  
      // Query to retrieve the users joined communities with pagination
  
      const memberRoleId = await Role.find({ name: "Community Member" });
  
      const query = {
        user: userId,
        role: memberRoleId,
      };
  
      const results = await Member.find(query);
      console.log(results);
  
      const allCommunitiesId = results.map((result) => {
        return result.community;
      });
  
      console.log(allCommunitiesId);
  
      const options = {
        page: currentPage,
        limit: pageLimit,
        select: "id name slug owner created_at updated_at",
        populate: {
          path: "owner",
          select: "id name",
        },
      };
  
      const communities = await Community.paginate(
        { _id: { $in: allCommunitiesId } },
        options
      );
  
      console.log(communities);
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: communities.totalDocs,
            pages: communities.totalPages,
            page: communities.page,
          },
          data: communities.docs,
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