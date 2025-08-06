// File: server/config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'A simple Express E-Commerce API documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the product.',
            },
            title: {
              type: 'string',
              description: 'The title of the product.',
            },
            description: {
              type: 'string',
              description: 'The description of the product.',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'The price of the product.',
            },
            image: {
              type: 'string',
              description: 'The local path to the product image.',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the user.',
            },
            email: {
              type: 'string',
              description: "The user's email address.",
            },
            displayName: {
              type: 'string',
              description: 'The name displayed for the user.',
            },
          },
        },
      },
    },
  },
  // Path to the API docs
  apis: ['./routes/*.js'], // This tells swagger-jsdoc to scan all .js files in the routes folder
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;