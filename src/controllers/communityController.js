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

const getAllMembers = async (req, res) => {
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

const getMyOwnedCommunity = async (req, res) => {
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

const getCommunityMeMember = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have access to the currently authenticated user's ID from the token
    const { page = 1, limit = 10 } = req.query;

    // Convert query parameters to integers for pagination
    const currentPage = parseInt(page);
    const pageLimit = parseInt(limit);

    // Query to retrieve the user's joined communities with pagination

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

export {
  createCommunity,
  getCommunity,
  getAllMembers,
  getMyOwnedCommunity,
  getCommunityMeMember,
};
