import type { Movie } from './generated/prisma';
import { Prisma, PrismaClient } from './generated/prisma';
import type { DeepMockProxy } from 'jest-mock-extended';
import { mockDeep } from 'jest-mock-extended';
import { MovieAdapter } from './movie.adapter';
import {
  generateMovieWithId,
  generateMovieWithoutId
} from './test-helpers/factories';

jest.mock('./generated/prisma', () => {
  const actualPrisma = jest.requireActual('./generated/prisma');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn(() => mockDeep<PrismaClient>())
  };
});

describe('MovieAdapter', () => {
  let prismaMock: DeepMockProxy<PrismaClient>;
  let movieAdapter: MovieAdapter;

  const mockMovie: Movie = generateMovieWithId() as Movie & { id: string };

  beforeEach(() => {
    prismaMock = new PrismaClient() as DeepMockProxy<PrismaClient>;
    movieAdapter = new MovieAdapter(prismaMock);
  });

  describe('getMovies', () => {
    it('should get all movies', async () => {
      prismaMock.movie.findMany.mockResolvedValue([mockMovie]);

      const { data } = await movieAdapter.getMovies();

      expect(data).toEqual([mockMovie]);
      expect(prismaMock.movie.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return no movies', async () => {
      prismaMock.movie.findMany.mockResolvedValue([]);

      const { data } = await movieAdapter.getMovies();

      expect(data).toEqual([]);
      expect(prismaMock.movie.findMany).toHaveBeenCalledTimes(1);
    });

    it('should handle error in getMovies', async () => {
      prismaMock.movie.findMany.mockRejectedValue(
        new Error('Error fetching all movies')
      );

      const result = await movieAdapter.getMovies();
      expect(result.data).toBeNull();
      expect(prismaMock.movie.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMovieById', () => {
    it('should get movie by id', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(mockMovie);

      //@ts-expect-error Incorrectly displaying error
      const { data } = await movieAdapter.getMovieById(mockMovie.id);

      expect(data).toEqual(mockMovie);
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id: mockMovie.id }
      });
    });

    it('should return null if movie by id not found', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(null);

      //@ts-expect-error Incorrectly displaying error
      const { data } = await movieAdapter.getMovieById(999);

      expect(data).toBeNull();
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
    });

    it('should handle errors in getMovieById', async () => {
      prismaMock.movie.findUnique.mockRejectedValue(
        new Error('Error fetching movie by id')
      );

      //@ts-expect-error Incorrectly displaying error
      const { data } = await movieAdapter.getMovieById(1);

      expect(data).toBeNull();
      expect(prismaMock.movie.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMovieByName', () => {
    it('should get movie by name', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(mockMovie);

      //@ts-expect-error Incorrectly displaying error
      const { data } = await movieAdapter.getMovieByName(mockMovie.name);

      expect(data).toEqual(mockMovie);
      expect(prismaMock.movie.findFirst).toHaveBeenCalledWith({
        where: { name: mockMovie.name }
      });
    });

    it('should return null if movie by name not found', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(null);

      //@ts-expect-error Incorrectly displaying error
      const { data } = await movieAdapter.getMovieByName('Movie Title');

      expect(data).toBeNull();
      expect(prismaMock.movie.findFirst).toHaveBeenCalledWith({
        where: { name: 'Movie Title' }
      });
    });

    it('should handle errors in getMovieByName', async () => {
      prismaMock.movie.findFirst.mockRejectedValue(
        new Error('Error fetching movie by id')
      );

      //@ts-expect-error Incorrectly displaying error
      const { data } = await movieAdapter.getMovieByName('Movie Title');

      expect(data).toBeNull();
      expect(prismaMock.movie.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteMovieById', () => {
    it('should delete movie by id', async () => {
      prismaMock.movie.delete.mockResolvedValue(mockMovie);

      const result = await movieAdapter.deleteMovieById(mockMovie.id);

      expect(result).toStrictEqual({
        status: 200,
        message: `Movie ID: ${mockMovie.id} deleted successfully`
      });
      expect(prismaMock.movie.delete).toHaveBeenCalledWith({
        where: { id: mockMovie.id }
      });
    });

    it('should delete a movie and return false if a movis is not found', async () => {
      prismaMock.movie.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Movie ID: 999 not found', {
          code: 'P2025',
          clientVersion: '1'
        })
      );

      const result = await movieAdapter.deleteMovieById(999);

      expect(result).toStrictEqual({
        status: 404,
        message: 'Movie ID: 999 not found'
      });
      expect(prismaMock.movie.delete).toHaveBeenCalledWith({
        where: { id: 999 }
      });
    });

    it('should handle unexpected errors in deleteMovieById', async () => {
      const unexpectedError = new Error('Unexpected error');
      prismaMock.movie.delete.mockRejectedValue(unexpectedError);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleErrorSpy = jest.spyOn(movieAdapter as any, 'handleError');

      await expect(movieAdapter.deleteMovieById(1)).rejects.toThrow(
        'Unexpected error'
      );
      expect(handleErrorSpy).toHaveBeenCalledWith(unexpectedError);
      expect(prismaMock.movie.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle prisma errors in deleteMovieById', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Timed out',
        {
          code: 'P2024',
          clientVersion: '1'
        }
      );
      prismaMock.movie.delete.mockRejectedValue(prismaError);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleErrorSpy = jest.spyOn(movieAdapter as any, 'handleError');

      await expect(movieAdapter.deleteMovieById(1)).rejects.toThrow(
        'Timed out'
      );
      expect(handleErrorSpy).toHaveBeenCalledWith(prismaError);
      expect(prismaMock.movie.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('createMovie', () => {
    const movieData = { ...generateMovieWithoutId(), name: 'Inception' };
    const id = 1;
    const movie = { id, ...movieData };
    it('should create a movies without an id', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.findMany.mockResolvedValue([mockMovie]);
      prismaMock.movie.create.mockResolvedValue(movie);

      const result = await movieAdapter.createMovie(movieData);

      expect(result).toEqual({
        status: 200,
        data: movie
      });
      expect(prismaMock.movie.create).toHaveBeenCalledWith({ data: movie });
    });

    it('should create a movies with an id', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.findMany.mockResolvedValue([mockMovie]);
      prismaMock.movie.create.mockResolvedValue(movie);

      const result = await movieAdapter.createMovie(movie);

      expect(result).toEqual({
        status: 200,
        data: movie
      });
      expect(prismaMock.movie.create).toHaveBeenCalledWith({ data: movie });
    });

    it('should return 409 if movie already exists', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(movie);

      const result = await movieAdapter.createMovie(movieData);

      expect(result).toEqual({
        status: 409,
        error: `Movie with name ${movieData.name} already exists`
      });
    });

    it('should handle 500 errors in createMovie', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.findMany.mockResolvedValue([]);
      const unexpectedError = new Error('Unexpected error');
      prismaMock.movie.create.mockRejectedValue(unexpectedError);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleErrorSpy = jest.spyOn(movieAdapter as any, 'handleError');
      const result = await movieAdapter.createMovie(movieData);

      expect(result).toEqual({
        status: 500,
        error: 'Failed to create movie'
      });
      expect(handleErrorSpy).toHaveBeenCalledWith(unexpectedError);
      expect(prismaMock.movie.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateMovie', () => {
    const id = 0;
    const existingMovie = {
      id: id,
      name: 'Inception',
      year: 2010,
      rating: 7.5
    };
    const updateMovieData = {
      name: 'The Dark Knight',
      year: 2008,
      rating: 8.5
    };
    const updatedMovie = { id, ...updateMovieData };

    it('should update a movie', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(existingMovie);
      prismaMock.movie.update.mockResolvedValue(updatedMovie);

      const result = await movieAdapter.updateMovie(id, updateMovieData);

      expect(result).toEqual({
        status: 200,
        data: updatedMovie
      });
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id }
      });
      expect(prismaMock.movie.update).toHaveBeenCalledWith({
        where: { id },
        data: updateMovieData
      });
    });

    it('should return 404 if movie not found', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(null);
      prismaMock.movie.update.mockResolvedValue(updatedMovie);

      const result = await movieAdapter.updateMovie(id, updateMovieData);

      expect(result).toEqual({
        status: 404,
        error: `Movie with ID: ${id} not found`
      });
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id }
      });
      expect(prismaMock.movie.update).not.toHaveBeenCalled();
    });

    it('should handle  errors in updateMovie', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(existingMovie);
      const internalError = new Error('Internal server error');
      prismaMock.movie.update.mockRejectedValue(internalError);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleErrorSpy = jest.spyOn(movieAdapter as any, 'handleError');
      const result = await movieAdapter.updateMovie(id, updateMovieData);

      expect(result).toEqual({
        status: 500,
        error: 'Internal server error'
      });
      expect(handleErrorSpy).toHaveBeenCalledWith(internalError);
      expect(prismaMock.movie.update).toHaveBeenCalledTimes(1);
    });
  });
});
