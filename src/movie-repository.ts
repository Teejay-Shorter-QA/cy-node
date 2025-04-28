import type {
  ConflictMovieResponse,
  CreateMovieRequest,
  CreateMovieResponse,
  DeleteMovieResponse,
  GetMovieResponse,
  MovieNotFoundResponse,
  UpdateMovieRequest,
  UpdateMovieResponse
} from './@types';

export interface MovieRepository {
  getMovies(): Promise<GetMovieResponse>;
  getMovieById(id: string): Promise<GetMovieResponse | MovieNotFoundResponse>;
  getMovieByName(
    name: string
  ): Promise<GetMovieResponse | MovieNotFoundResponse>;
  deleteMovieById(
    id: number
  ): Promise<DeleteMovieResponse | MovieNotFoundResponse>;
  createMovie(
    data: CreateMovieRequest
  ): Promise<CreateMovieResponse | ConflictMovieResponse>;
  updateMovie(
    id: number,
    data: UpdateMovieRequest
  ): Promise<
    UpdateMovieResponse | MovieNotFoundResponse | ConflictMovieResponse
  >;
}
