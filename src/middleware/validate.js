function validate(ajvValidate) {
  return (req, res, next) => {
    const valid = ajvValidate(req.body);
    if (!valid) {
      const errors = ajvValidate.errors;
      // req.error=errors;
      // next();
      const data = errors.map((error) => {
        return {
          param: error.instancePath.substr(1),
          message: error.message,
          code: "INVALID_INPUT",
        };
      });
      res.status(400).json({
        status: false,
        errors: data,
        // errordata:errors
      });
    } else {
      next();
    }
  };
}

export default validate;
