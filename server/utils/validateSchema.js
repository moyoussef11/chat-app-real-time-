const Joi = require('joi');

function validateRegister(obj) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(15).required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

function validateLogin(obj) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}




module.exports = { validateRegister, validateLogin };
