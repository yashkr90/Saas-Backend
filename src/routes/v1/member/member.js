import Express from "express";
import authenticate from "../../../middleware/authentication.js";
// import validate from "../../../middleware/validate.js";
// import { addMember, removeMember } from "../../../controllers/memberController.js";

import { addMember, removeMember } from "../../../controllers/memberController/memberController.js";

const router = Express.Router();

router.post("/v1/member",authenticate,addMember);
router.delete("/v1/member/:id",authenticate,removeMember);

export default router;

