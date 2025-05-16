import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);
export const CreateMovieSchema = z
  .object({
    id: z
      .number()
      .int()
      .optional()
      .openapi({ example: 1, description: 'Movie ID' }),
    name: z
      .string()
      .min(1)
      .openapi({ example: 'Inception', description: 'Movie name' }),
    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear())
      .openapi({ example: 2010, description: 'Movie release year' }),
    rating: z.number().openapi({ example: 7.5, description: 'Movie rating' })
  })
  .openapi('CreateMovieRequest');

export const CreateMoveResponseSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 200, description: 'Response status code' }),
    data: z.object({
      id: z.number().int().openapi({ example: 1, description: 'Movie ID' }),
      name: z
        .string()
        .openapi({ example: 'Inception', description: 'Movie name' }),
      year: z
        .number()
        .int()
        .openapi({ example: 2010, description: 'Movie release year' }),
      rating: z.number().openapi({ example: 7.5, description: 'Movie rating' })
    }),
    error: z.string().optional().openapi({ description: 'Error message' })
  })
  .openapi('CreateMovieResponse');

export const ConflictMovieResponseSchema = z.object({
  status: z
    .number()
    .int()
    .openapi({ example: 409, description: 'Conflict status code' }),
  error: z
    .string()
    .openapi({ example: 'Movie already exists', description: 'Error message' })
});

const movieObj = {
  id: z.number().openapi({ example: 1, description: 'Movie ID' }),
  name: z.string().openapi({ example: 'Inception', description: 'Movie name' }),
  year: z
    .number()
    .openapi({ example: 2010, description: 'Movie release year' }),
  rating: z.number().openapi({ example: 7.5, description: 'Movie rating' })
};

export const GetMovieResponseUnionSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 200, description: 'Response status code' }),
    data: z
      .object(movieObj)
      .nullable()
      .openapi({
        example: { id: 1, name: 'Inception', year: 2010, rating: 7.5 }
      })
      .or(
        z.array(z.object(movieObj)).openapi({
          example: [],
          description: 'List of movies or an empty array'
        })
      ),
    error: z.string().nullable().optional().openapi({
      example: null,
      description: 'Error message occurred, otherwise null'
    })
  })
  .openapi('GetMovieResponse');

export const MovieNotFoundResponseSchema = z.object({
  status: z
    .number()
    .int()
    .openapi({ example: 404, description: 'Response status code' }),
  error: z
    .string()
    .openapi({ example: 'Movie not found', description: 'Error message' })
});

export const DeleteMovieResponseSchema = z.object({
  status: z
    .number()
    .int()
    .openapi({ example: 200, description: 'Response status code' }),
  message: z.string().openapi({
    example: 'Movie {id} has been deleted',
    description: 'Success message for deleted movie'
  })
});

export const UpdateMovieSchema = z
  .object({
    id: z.number().optional().openapi({ example: 1, description: 'Movie ID' }),
    name: z
      .string()
      .min(1)
      .optional()
      .openapi({ example: 'Inception', description: 'Movie name' }),
    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear())
      .optional()
      .openapi({ example: 2010, description: 'Movie release year' }),
    rating: z
      .number()
      .optional()
      .openapi({ example: 7.5, description: 'Movie rating' })
  })
  .openapi('UpdateMovieRequest');

export const UpdateMovieResponseSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 200, description: 'Response status code' }),
    data: z
      .object({
        id: z.number().openapi({ example: 1, description: 'Movie ID' }),
        name: z
          .string()
          .openapi({ example: 'Inception', description: 'Movie name' }),
        year: z
          .number()
          .int()
          .openapi({ example: 2010, description: 'Movie release year' }),
        rating: z
          .number()
          .openapi({ example: 7.5, description: 'Movie rating' })
      })
      .openapi('UpdatedMovieData'),
    error: z
      .string()
      .optional()
      .openapi({ description: 'Error message, if any' })
  })
  .openapi('UpdatedMovieResponse');
