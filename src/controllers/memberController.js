import { User, Community, Role, Member } from "../models/model.js";

// POST /v1/member route handler for adding a member to a community
const addMember = async (req, res) => {
  const { id } = req.user;

  try {
    // Extract data from the request body
    const { community, user, role } = req.body;

    // Check if the community exists
    const existingCommunity = await Community.findById(community);

    console.log(typeof existingCommunity.owner);
    console.log(existingCommunity.owner);
    console.log(typeof id);
    console.log(id);

    if (existingCommunity.owner !== id) {
      //   throw [
      //     {
      //       message: "Only Community Admin can add users.",
      //       code: "NOT_ALLOWED_ACCESS",
      //     },
      //   ];
      return res.status(403).json({
        status: false,
        errors: [
          {
            message: "Only Community Admin can add users.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }

    if (!existingCommunity) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "community",
            message: "Community not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    // Check if the user is already a member of the community
    const existingMember = await Member.findOne({ community, user });

    if (existingMember) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "User is already added in the community.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    // Check if the role exists
    const existingRole = await Role.findById(role);

    if (!existingRole) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "role",
            message: "Role not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    // Check if the user exists
    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "user",
            message: "User not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    // Create the member with the provided data
    const member = new Member({
      community,
      user,
      role,
    });

    await member.save();

    res.status(201).json({
      status: true,
      content: {
        data: member,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      error: error,
    });
  }
};

const removeMember = async (req, res) => {
  const memberId = req.params.id;

  const signInUserId = req.user.id;

  try {
    //get member document where memberis presesnt
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            message: "Member not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    const communityId = member.community;

    const roles = await Role.find({
      name: { $in: ["Community Admin", "Community Moderator"] },
    });

    //members who are part of memberId community and is Admin or moderaotr
    const members = await Member.find({
      community: communityId,
      role: { $in: roles },
    });

    console.log(members);

    const usersAdminOrModerator = members.map((member) => {
      return member.user;
    });

    console.log(signInUserId);
    console.log(usersAdminOrModerator);
    const isAdminOrModerator = usersAdminOrModerator.includes(signInUserId);

    if (!isAdminOrModerator) {
      return res.status(403).json({
        status: false,
        errors: [
          {
            message: "Only Community Admin can add users.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }

    // Remove the member
    await Member.findByIdAndDelete(memberId);

    res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.log("error is", error);
    res.status(400).json({
      status: false,
      error: error,
    });
  }
};

export { addMember, removeMember };
