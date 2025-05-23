import {
  OpenAPIRegistry,
  OpenApiGeneratorV31
} from '@asteasolutions/zod-to-openapi';
import {
  ConflictMovieResponseSchema,
  CreateMoveResponseSchema,
  CreateMovieSchema,
  DeleteMovieResponseSchema,
  GetMovieResponseUnionSchema,
  MovieNotFoundResponseSchema,
  UpdateMovieResponseSchema,
  UpdateMovieSchema
} from '../@types/schema';
import type { ParameterObject } from 'openapi3-ts/oas31';

// Register the schemas
const registry = new OpenAPIRegistry();
registry.register('CreateMovieRequest', CreateMovieSchema);
registry.register('CreateMovieResponse', CreateMoveResponseSchema);
registry.register('ConflictMovieResponse', ConflictMovieResponseSchema);
registry.register('GetMovieResponse', GetMovieResponseUnionSchema);
registry.register('MovieNotFoundResponse', MovieNotFoundResponseSchema);
registry.register('UpdateMovieRequest', UpdateMovieSchema);
registry.register('UpdateMovieResponse', UpdateMovieResponseSchema);
registry.register('DeleteMovieResponse', DeleteMovieResponseSchema);

const MOVIE_ID_PARAM: ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: {
    type: 'string'
  },
  description: 'Movie ID'
};

const MOVIE_NAME_PARAM: ParameterObject = {
  name: 'name',
  in: 'query',
  required: false,
  schema: { type: 'string' },
  description: 'Movie name'
};

// Register the paths
registry.registerPath({
  method: 'get',
  path: '/',
  summary: 'Health check',
  responses: {
    200: {
      description: 'Server is running',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Server is running'
              }
            }
          }
        }
      }
    }
  }
});

// Register path for getting all movies or filtering by name via query parameter
registry.registerPath({
  method: 'get',
  path: '/movies',
  summary: 'Get all movies filtered by name',
  parameters: [MOVIE_NAME_PARAM],
  description:
    'Retrieve a list of all movies. Optionally provide a movie name to filter results',
  responses: {
    200: {
      description: 'List of movies',
      content: {
        'application/json': {
          schema: GetMovieResponseUnionSchema
        }
      }
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    }
  }
});

// Register path for getting a movie by id
registry.registerPath({
  method: 'get',
  path: '/movies/{id}',
  summary: 'Get movie by id',
  parameters: [MOVIE_ID_PARAM],
  description: 'Retrieve a single movie by its id',
  responses: {
    200: {
      description: 'Movie data',
      content: {
        'application/json': {
          schema: GetMovieResponseUnionSchema
        }
      }
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    }
  }
});

// Register path for adding a movie
registry.registerPath({
  method: 'post',
  path: '/movies',
  summary: 'Create a new movie',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateMovieSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Movie data',
      content: {
        'application/json': {
          schema: CreateMoveResponseSchema
        }
      }
    },
    400: {
      description: 'Invalid request body or validation error'
    },
    409: {
      description: 'Movie already exists',
      content: {
        'application/json': {
          schema: ConflictMovieResponseSchema
        }
      }
    },
    500: { description: 'Unexpected error occurred' }
  }
});

// Register path for deleting a movie
registry.registerPath({
  method: 'delete',
  path: '/movies/{id}',
  summary: 'Delete a movie',
  parameters: [MOVIE_ID_PARAM],
  responses: {
    200: {
      description: 'Movie {id} has been deleted}',
      content: {
        'application/json': {
          schema: DeleteMovieResponseSchema
        }
      }
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    },
    500: { description: 'Unexpected error occurred' }
  }
});

// Register path for updating a movie
registry.registerPath({
  method: 'put',
  path: '/movies/{id}',
  summary: 'Update a movie by its id',
  description: 'Update a movie by its id',
  parameters: [MOVIE_ID_PARAM],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateMovieSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Movie updated successfully}',
      content: {
        'application/json': {
          schema: UpdateMovieResponseSchema
        }
      }
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    },
    500: { description: 'Unexpected error occurred' }
  }
});

// Generate OpenAPI documents
const generator = new OpenApiGeneratorV31(registry.definitions);
export const openApiDoc = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Movies API',
    version: '0.0.2',
    description: 'API for managing movies'
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local dev server'
    },
    {
      url: 'http://movies-api.example.com',
      description: 'Production server'
    }
  ]
});
