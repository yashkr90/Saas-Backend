import Express from "express";
import authenticate from "../../../middleware/authentication.js";
import validate from "../../../middleware/validate.js";
import communityValidate from "../../../validations/community/communityValidation.js";
import {
  createCommunity,
  getCommunity,
  getAllMembers,
  getMyOwnedCommunity,
  getCommunityMeMember,
} from "../../../controllers/communityController.js";

const router = Express.Router();

router.post(
  "/v1/community",
  validate(communityValidate),
  authenticate,
  createCommunity
);

router.get("/v1/community", getCommunity);
router.get("/v1/community/:id/members", getAllMembers);
router.get("/v1/community/me/owner", authenticate, getMyOwnedCommunity);
router.get("/v1/community/me/member", authenticate, getCommunityMeMember);

export default router;
