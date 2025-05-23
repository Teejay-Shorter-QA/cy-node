import type { Response } from 'express';
import type {
  ConflictMovieResponse,
  CreateMovieResponse,
  DeleteMovieResponse,
  GetMovieResponse,
  UpdateMovieResponse,
  MovieNotFoundResponse
} from '../@types';

type MovieResponse =
  | ConflictMovieResponse
  | CreateMovieResponse
  | DeleteMovieResponse
  | GetMovieResponse
  | UpdateMovieResponse
  | MovieNotFoundResponse;

export function formatResponse(res: Response, result: MovieResponse): Response {
  if ('error' in result && result.error) {
    return res
      .status(result.status)
      .json({ status: result.status, error: result.error });
  } else if ('data' in result) {
    if (result.data === null) {
      return res
        .status(result.status)
        .json({ status: result.status, error: 'No movies found' });
    }
    return res
      .status(result.status)
      .json({ status: result.status, data: result.data });
  } else if ('message' in result) {
    return res
      .status(result.status)
      .json({ status: result.status, message: result.message });
  } else {
    return res.status(500).json({ error: 'Unexpected error occurred' });
  }
}
