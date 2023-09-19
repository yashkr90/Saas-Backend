import Express from "express";
import validate from "../../../middleware/validate.js";
import roleValidate from "../../../validations/role/roleValidation.js";
// import { createRole,getAll } from "../../../controllers/roleController.js";
import { getAll,createRole } from "../../../controllers/roleController/roleController.js";

const router = Express.Router();

// Create a new role
router.post("/v1/role", validate(roleValidate), createRole);


// get all role
router.get("/v1/role", getAll);

export default router;
