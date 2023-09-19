import { User, Community,Role, Member } from "../../models/model.js";

export const removeMember = async (req, res) => {
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