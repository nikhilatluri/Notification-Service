const swaggerJsdoc = require('swagger-jsdoc');
module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Notification Service API', version: '1.0.0', description: 'HMS - Notification Service' },
    servers: [{ url: 'http://localhost:3007', description: 'Development server' }]
  },
  apis: ['./src/routes/*.js']
});
