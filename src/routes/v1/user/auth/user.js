import Express from "express";
// import authenticate from "../../../middleware/authentication";
import validate from "../../../../middleware/validate.js";
import {signUpValidate, signInValidate} from "../../../../validations/user/userValidation.js";
import authenticate from "../../../../middleware/authentication.js";
import { signUp, signIn,getMe } from "../../../../controllers/userController.js";

const router = Express.Router();

router.post("/v1/auth/signup",validate(signUpValidate),signUp);
router.post("/v1/auth/signin",validate(signInValidate), signIn);
router.get("/v1/auth/me",authenticate,getMe);


export default router;