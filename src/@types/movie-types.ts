import type { z } from 'zod';
import type {
  CreateMoveResponseSchema,
  CreateMovieSchema,
  GetMovieResponseUnionSchema,
  MovieNotFoundResponseSchema,
  DeleteMovieResponseSchema,
  ConflictMovieResponseSchema,
  UpdateMovieSchema,
  UpdateMovieResponseSchema
} from './schema';

export type ConflictMovieResponse = z.infer<typeof ConflictMovieResponseSchema>;
export type CreateMovieRequest = z.infer<typeof CreateMovieSchema>;
export type CreateMovieResponse = z.infer<typeof CreateMoveResponseSchema>;
export type DeleteMovieResponse = z.infer<typeof DeleteMovieResponseSchema>;
export type GetMovieResponse = z.infer<typeof GetMovieResponseUnionSchema>;
export type MovieNotFoundResponse = z.infer<typeof MovieNotFoundResponseSchema>;
export type UpdateMovieRequest = z.infer<typeof UpdateMovieSchema>;
export type UpdateMovieResponse = z.infer<typeof UpdateMovieResponseSchema>;
