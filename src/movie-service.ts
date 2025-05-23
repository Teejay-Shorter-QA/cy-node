import type { MovieRepository } from './movie-repository';
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
import type { ZodSchema } from 'zod';
import { CreateMovieSchema, UpdateMovieSchema } from './@types/schema';

export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async getMovies(): Promise<GetMovieResponse> {
    return this.movieRepository.getMovies();
  }

  async getMovieById(
    id: number
  ): Promise<GetMovieResponse | MovieNotFoundResponse> {
    return this.movieRepository.getMovieById(id);
  }

  async getMovieByName(
    name: string
  ): Promise<GetMovieResponse | MovieNotFoundResponse> {
    return this.movieRepository.getMovieByName(name);
  }

  async deleteMovieById(
    id: number
  ): Promise<DeleteMovieResponse | MovieNotFoundResponse> {
    return this.movieRepository.deleteMovieById(id);
  }

  async createMovie(
    data: CreateMovieRequest
  ): Promise<CreateMovieResponse | ConflictMovieResponse> {
    const validationResult = validateSchema(CreateMovieSchema, data);
    if (!validationResult.success) {
      return { status: 400, error: validationResult.error };
    }
    return this.movieRepository.createMovie(data);
  }

  async updateMovie(
    id: number,
    data: UpdateMovieRequest
  ): Promise<
    UpdateMovieResponse | MovieNotFoundResponse | ConflictMovieResponse
  > {
    const validationResult = validateSchema(UpdateMovieSchema, data);
    if (!validationResult.success) {
      return { status: 400, error: validationResult.error };
    }
    return this.movieRepository.updateMovie(id, data);
  }
}

function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    console.log('Validation Error: ' + result.error);
    const errorMessages = result.error.errors
      .map((err) => err.message)
      .join(', ');
    return { success: false, error: errorMessages };
  }
}
