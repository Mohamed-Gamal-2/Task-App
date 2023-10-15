//Validation for body

const validateBody = (validationSchema) => {
  return (req, res, next) => {
    const { error } = validationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) res.status(400).json({ Message: error });
    else next();
  };
};

//Validation for params

const validateParams = (validationSchema) => {
  return (req, res, next) => {
    const { error } = validationSchema.validate(req.params, {
      abortEarly: false,
    });
    if (error) res.status(400).json({ Message: error });
    else next();
  };
};

//Exporting
export { validateBody, validateParams };
