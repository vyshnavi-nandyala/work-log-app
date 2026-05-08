const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    return res.status(400).json({ success: false, error: message });
  }
  req.body = value;
  next();
};

const logSchema = Joi.object({
  taskName: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(2000).allow('', null),
  project: Joi.string().max(255).allow('', null),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().min(Joi.ref('startTime')).allow(null),
  tags: Joi.array().items(Joi.string().max(50)).default([]),
  status: Joi.string().valid('in_progress', 'completed', 'on_hold').default('in_progress'),
  priority: Joi.string().valid('high', 'medium', 'low').default('medium'),
  categoryId: Joi.string().uuid().allow(null),
});

const categorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#6366f1'),
  icon: Joi.string().max(10).default('📁'),
});

module.exports = { validate, logSchema, categorySchema };
