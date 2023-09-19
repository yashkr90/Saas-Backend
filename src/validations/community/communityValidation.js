import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });
import ajvErrors from "ajv-errors";


ajvErrors(ajv /*, { singleError: true } */);

const communitySchema = {
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
  
    required: ["name"]
  };
  
  const communityValidate = ajv.compile(communitySchema);

export default communityValidate;