import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });
import ajvErrors from "ajv-errors";
ajvErrors(ajv /*, { singleError: true } */);
import addFormats from "ajv-formats";

addFormats(ajv);

const signUpSchema = {
  type: "object",
  allOf: [
    {
      properties: {
        name: {
          type: "string",
          minLength: 2,
        },
        email: {
          type: "string",
          format: "email",
        },
        password: {
          type: "string",
          minLength: 6,
        },
      },
    },
  ],
  errorMessage: {
    properties: {
      name: "Name should be at least 2 characters.",
      password: "Password should be at least 2 characters.",
    },
  },

  required: ["name", "email", "password"],
};

const signInSchema={
    type: "object",
    allOf: [
      {
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",

          },
        },
      },
    ],
    errorMessage: {
      properties: {
        email: "Please provide a valid email address.",
       
      },
    },
  
    required: ["email", "password"],
}

const signUpValidate = ajv.compile(signUpSchema);
const signInValidate=ajv.compile(signInSchema);

export {signUpValidate,signInValidate} 
