import { OpenAPIV3 } from 'openapi-types';

const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Trip Favorites API',
    version: '1.0.0',
    description: 'API for managing and retrieving user favorite trips',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
      description: 'Local server',
    },
  ],
  paths: {
    '/trips': {
      get: {
        summary: 'Retrieve a list of trips',
        parameters: [
          {
            in: 'query',
            name: 'origin',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'IATA code for the origin',
          },
          {
            in: 'query',
            name: 'destination',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'IATA code for the destination',
          },
          {
            in: 'query',
            name: 'sort_by',
            schema: {
              type: 'string',
              enum: ['cheapest', 'fastest'],
            },
            required: true,
            description: "Sort by either 'cheapest' or 'fastest'",
          },
        ],
        responses: {
          '200': {
            description: 'A list of trips',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Trip',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid request parameters',
          },
          '500': {
            description: 'Server error',
          },
        },
      },
    },
    '/favorites/add': {
      post: {
        summary: "Add a trip to the user's favorite list",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                  },
                  trip: {
                    $ref: '#/components/schemas/Trip',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Trip added to favorites',
          },
          '400': {
            description: 'Missing or invalid parameters',
          },
          '409': {
            description: 'Trip already in favorites',
          },
          '500': {
            description: 'Server error',
          },
        },
      },
    },
    '/favorites/byUsername': {
      get: {
        summary: "Retrieve a user's favorite trips by username",
        parameters: [
          {
            in: 'query',
            name: 'username',
            schema: {
              type: 'string',
            },
            required: true,
            description: "The user's username",
          },
        ],
        responses: {
          '200': {
            description: "A list of the user's favorite trips",
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Favorites',
                },
              },
            },
          },
          '400': {
            description: 'Missing username',
          },
          '404': {
            description: 'No favorites found',
          },
          '500': {
            description: 'Server error',
          },
        },
      },
    },
    '/favorites/remove': {
      delete: {
        summary: "Remove a trip from the user's favorite list",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                  },
                  tripId: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Trip removed from favorites',
          },
          '400': {
            description: 'Missing or invalid parameters',
          },
          '404': {
            description: 'User or trip not found',
          },
          '500': {
            description: 'Server error',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Trip: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
          },
          id: {
            type: 'string',
          },
          display_name: {
            type: 'string',
          },
          destination: {
            type: 'string',
          },
          origin: {
            type: 'string',
          },
          duration: {
            type: 'number',
          },
          cost: {
            type: 'number',
          },
        },
      },
      Favorites: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
          },
          trips: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Trip',
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
