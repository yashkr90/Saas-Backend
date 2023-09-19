import Express from "express";
import authenticate from "../../../middleware/authentication.js";
import validate from "../../../middleware/validate.js";
import communityValidate from "../../../validations/community/communityValidation.js";
import { createRole,getAll } from "../../../controllers/roleController.js";
import { createCommunity,getCommunity } from "../../../controllers/communityController.js";


const router = Express.Router();


router.post("/v1/community", validate(communityValidate), authenticate, createCommunity);
router.get("/v1/community",getCommunity);




export default router;
