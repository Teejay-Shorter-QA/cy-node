import type { PrismaClient } from './generated/prisma';
import { PrismaClientKnownRequestError } from './generated/prisma/runtime/library';
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
import type { MovieRepository } from './movie-repository';

export class MovieAdapter implements MovieRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Error handling method
  private handleError(error: unknown): void {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(
        'Prisma error code:',
        error.code,
        'Message:',
        error.message
      );
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unknown error occurred', error);
    }
  }

  // Get all movies
  async getMovies(): Promise<GetMovieResponse> {
    try {
      const movies = await this.prisma.movie.findMany();
      if (movies.length > 0) {
        return {
          status: 200,
          data: movies,
          error: null
        };
      } else {
        return {
          status: 200,
          data: [],
          error: null
        };
      }
    } catch (error) {
      this.handleError(error);

      return {
        status: 500,
        data: null,
        error: 'Failed to retrieve movies'
      };
    }
  }

  // Get movie by ID
  async getMovieById(
    id: number
  ): Promise<GetMovieResponse | MovieNotFoundResponse> {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } });
      if (movie) {
        return {
          status: 200,
          data: movie,
          error: null
        };
      } else {
        return {
          status: 404,
          data: null,
          error: `Movie ID: ${id} not found`
        };
      }
    } catch (error) {
      this.handleError(error);
      return {
        status: 500,
        data: null,
        error: 'Internal server error'
      };
    }
  }

  // Get movie by Name
  async getMovieByName(
    name: string
  ): Promise<GetMovieResponse | MovieNotFoundResponse> {
    try {
      const movie = await this.prisma.movie.findFirst({ where: { name } });
      if (movie) {
        return {
          status: 200,
          data: movie,
          error: null
        };
      } else {
        return {
          status: 404,
          data: null,
          error: `Movie Name: ${name} not found`
        };
      }
    } catch (error) {
      this.handleError(error);
      return {
        status: 500,
        data: null,
        error: 'Internal server error'
      };
    }
  }

  // Delete movie by ID
  async deleteMovieById(
    id: number
  ): Promise<DeleteMovieResponse | MovieNotFoundResponse> {
    try {
      await this.prisma.movie.delete({ where: { id } });
      return {
        status: 200,
        message: `Movie ID: ${id} deleted successfully`
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return {
          status: 404,
          message: `Movie ID: ${id} not found`
        };
      }
      this.handleError(error);
      throw error;
    }
  }

  // Create movie
  async createMovie(
    data: CreateMovieRequest
  ): Promise<CreateMovieResponse | ConflictMovieResponse> {
    try {
      // Check if the movie already exists
      const existingMovie = await this.prisma.movie.findFirst({
        where: { name: data.name, year: data.year, rating: data.rating }
      });
      if (existingMovie) {
        return {
          status: 409,
          error: `Movie with name ${data.name} already exists`
        };
      }

      // Get list of all movies to assign new unique value to the id as movies.length
      const movies = await this.prisma.movie.findMany();
      const movie = await this.prisma.movie.create({
        data: data.id
          ? { ...data, id: data.id }
          : { ...data, id: movies.length }
      });
      return {
        status: 200,
        data: movie
      };
    } catch (error) {
      this.handleError(error);
      return {
        status: 500,
        error: 'Failed to create movie'
      };
    }
  }

  // Update movie
  async updateMovie(
    id: number,
    data: UpdateMovieRequest
  ): Promise<
    UpdateMovieResponse | MovieNotFoundResponse | ConflictMovieResponse
  > {
    try {
      // Check if the movie already exists
      const existingMovie = await this.prisma.movie.findUnique({
        where: { id }
      });

      if (!existingMovie) {
        return {
          status: 404,
          error: `Movie with ID: ${id} not found`
        };
      }

      const updatedMovie = await this.prisma.movie.update({
        where: { id },
        data
      });
      return {
        status: 200,
        data: updatedMovie
      };
    } catch (error) {
      this.handleError(error);
      return { status: 500, error: 'Internal server error' };
    }
  }
}
