const Joi = require('joi');
const { AppError } = require('./errorHandler');

const schemas = {
  sendNotification: Joi.object({
    patient_id: Joi.number().integer().positive().required(),
    type: Joi.string().valid('APPOINTMENT_CONFIRMATION', 'APPOINTMENT_REMINDER', 'CANCELLATION', 'BILL_GENERATED', 'PAYMENT_RECEIVED', 'APPOINTMENT_RESCHEDULED').required(),
    message: Joi.string().required(),
    metadata: Joi.object().optional()
  }),
  searchQuery: Joi.object({
    patient_id: Joi.number().integer().positive(),
    type: Joi.string(),
    status: Joi.string().valid('SENT', 'READ'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  })
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) return next(new AppError('Validation schema not found', 500));
    const dataToValidate = req.method === 'GET' ? req.query : req.body;
    const { error, value } = schema.validate(dataToValidate, { abortEarly: false, stripUnknown: true });
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 400, 'VALIDATION_ERROR'));
    }
    if (req.method === 'GET') req.query = value;
    else req.body = value;
    next();
  };
};

module.exports = { validate };
