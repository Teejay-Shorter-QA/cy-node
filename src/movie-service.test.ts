import { MovieService } from './movie-service';
import type { MovieRepository } from './movie-repository';
import type { Movie } from './generated/prisma';
import { generateMovieWithoutId } from './test-helpers/factories';

describe('MovieService', () => {
  let movieService: MovieService;
  let mockMovieReposity: jest.Mocked<MovieRepository>;

  const id = 1;
  const mockMovie: Movie = { ...generateMovieWithoutId(), id };
  const mockMovieResponse = { status: 200, data: mockMovie, error: null };
  const mockMoviesResponse = { status: 200, data: [mockMovie], error: null };
  const notFoundResponse = { status: 404, data: null, error: null };

  beforeEach(() => {
    mockMovieReposity = {
      getMovies: jest.fn(),
      getMovieById: jest.fn(),
      getMovieByName: jest.fn(),
      deleteMovieById: jest.fn(),
      createMovie: jest.fn(),
      updateMovie: jest.fn()
    } as jest.Mocked<MovieRepository>;
    movieService = new MovieService(mockMovieReposity);
  });

  it('should get all movies', async () => {
    mockMovieReposity.getMovies.mockResolvedValue(mockMoviesResponse);

    const { data } = await movieService.getMovies();

    expect(data).toEqual([mockMovie]);
    expect(mockMovieReposity.getMovies).toHaveBeenCalledTimes(1);
  });

  it('should get movie by id', async () => {
    mockMovieReposity.getMovieById.mockResolvedValue(mockMovieResponse);

    //@ts-expect-error Incorrectly displaying error
    const { data } = await movieService.getMovieById(id);

    expect(data).toEqual(mockMovie);
    expect(mockMovieReposity.getMovieById).toHaveBeenCalledWith(id);
  });

  it('should return null if movie by id not found', async () => {
    mockMovieReposity.getMovieById.mockResolvedValue(notFoundResponse);

    //@ts-expect-error Incorrectly displaying error
    const { data } = await movieService.getMovieById(999);

    expect(data).toBeNull();
    expect(mockMovieReposity.getMovieById).toHaveBeenCalledWith(999);
  });

  it('should get movie by name', async () => {
    mockMovieReposity.getMovieByName.mockResolvedValue(mockMovieResponse);

    //@ts-expect-error Incorrectly displaying error
    const { data } = await movieService.getMovieByName(mockMovie.name);

    expect(data).toEqual(mockMovie);
    expect(mockMovieReposity.getMovieByName).toHaveBeenCalledWith(
      mockMovie.name
    );
  });

  it('should return null if movie by name not found', async () => {
    mockMovieReposity.getMovieByName.mockResolvedValue(notFoundResponse);

    //@ts-expect-error Incorrectly displaying error
    const { data } = await movieService.getMovieByName(mockMovie.name);

    expect(data).toBeNull();
    expect(mockMovieReposity.getMovieByName).toHaveBeenCalledWith(
      mockMovie.name
    );
  });

  it('should create a movie', async () => {
    const expectedResult = {
      status: 200,
      data: mockMovie,
      error: undefined
    };
    mockMovieReposity.createMovie.mockResolvedValue(expectedResult);

    const result = await movieService.createMovie(mockMovie);

    expect(result).toEqual(expectedResult);
    expect(mockMovieReposity.createMovie).toHaveBeenCalledWith(mockMovie);
  });

  it('should return 400 if createMovie validation fails', async () => {
    const invalidMovieData = {
      name: '',
      year: 2000,
      rating: 2.5
    };

    const result = await movieService.createMovie(invalidMovieData);

    expect(result).toEqual({
      status: 400,
      error: 'String must contain at least 1 character(s)'
    });
  });

  it('should update a movie', async () => {
    const expectedResult = {
      status: 200,
      data: mockMovie,
      error: undefined
    };
    mockMovieReposity.updateMovie.mockResolvedValue(expectedResult);

    const result = await movieService.updateMovie(id, {
      rating: mockMovie.rating
    });

    expect(result).toEqual(expectedResult);
    expect(mockMovieReposity.updateMovie).toHaveBeenCalledWith(id, {
      rating: mockMovie.rating
    });
  });

  it('should return 400 if updateMovie validation fails', async () => {
    const invalidMovieData = {
      year: 1899
    };

    const result = await movieService.updateMovie(id, invalidMovieData);

    expect(result).toEqual({
      status: 400,
      error: 'Number must be greater than or equal to 1900'
    });
  });

  it('should delete movie by id', async () => {
    const expectedResult = {
      status: 200,
      message: 'Movie Deleted'
    };
    mockMovieReposity.deleteMovieById.mockResolvedValue(expectedResult);

    const result = await movieService.deleteMovieById(id);

    expect(result).toEqual(expectedResult);
    expect(mockMovieReposity.deleteMovieById).toHaveBeenCalledWith(id);
  });
});
