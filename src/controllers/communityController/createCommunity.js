import { Community, Role, Member } from "../../models/model.js";

export const createCommunity = async (req, res) => {
    try {
      // Extract data from the request body
      const { name } = req.body;
  
      //  currently authenticated user's ID from the token
      const ownerId = req.user.id; 
  
      const slug = name.toLowerCase().replace(/\s+/g, "-"); // Autogenerate slug from name
  
      // Create the community with the provided data
      const community = await Community.create({
        name: name,
        slug: slug,
        owner: ownerId,
      });
  
      // Retrieve the role ID for 'Community Admin'
      const adminRole = await Role.findOne({
        where: { name: "Community Admin" },
      });
  
      // Add the user as the owner with the role 'Community Admin'
      await Member.create({
        community: community.id,
        user: ownerId,
        role: adminRole.id,
      });
  
      // Return a JSON response with the created community
      res.status(201).json({
        status: true,
        content: {
          data: {
            id: community.id,
            name: community.name,
            slug: community.slug,
            owner: community.owner,
            created_at: community.created_at,
            updated_at: community.updated_at,
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