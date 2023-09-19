import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });
import ajvErrors from "ajv-errors";


ajvErrors(ajv /*, { singleError: true } */);



const roleSchema = {
  type: "object",
  allOf: [
    {
      properties: {
        name: {
          type: "string",
          minLength: 2,
        },
      },
    },
  ],
  errorMessage: {
    properties: {
      name: "Name should be at least 2 characters.",
    },
  },

  required: ["name"],
};

const roleValidate = ajv.compile(roleSchema);

export default roleValidate;
