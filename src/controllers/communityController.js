import { Community, Role, Member } from "../models/model.js";

const createCommunity = async (req, res) => {
  try {
    // Extract data from the request body
    const { name } = req.body;

    // Assuming you have access to the currently authenticated user's ID from the token
    const ownerId = req.user.id; // Adjust this based on your authentication mechanism

    const slug = name.toLowerCase().replace(/\s+/g, "-"); // Autogenerate slug from name

    // Create the community with the provided data
    const community = await Community.create({
      name: name,
      slug: slug,
      owner: ownerId,
    });

    // Retrieve the role ID for 'Community Admin' (adjust this based on your database setup)
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

const getCommunity = async (req, res) => {
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

export { createCommunity, getCommunity };
