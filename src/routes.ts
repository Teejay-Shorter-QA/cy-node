import type { Movie } from './generated/prisma';
import { PrismaClient } from './generated/prisma';
import type { Request, Response, RequestHandler } from 'express';
import { Router } from 'express';
import type {
  ConflictMovieResponse,
  CreateMovieResponse,
  DeleteMovieResponse,
  GetMovieResponse,
  MovieNotFoundResponse,
  UpdateMovieResponse
} from './@types';
import { authMiddleware } from './middleware/auth-middleware';
import { validateId } from './middleware/validate-movie-id';
import { MovieAdapter } from './movie-adapter';
import { MovieService } from './movie-service';
import { formatResponse } from './utils/format-response';
//import { produceMovieEvent } from './events/movie-events';

export const moviesRoute = Router();

// apply auth middleware to all routes under this prefix
moviesRoute.use(authMiddleware as RequestHandler);

const prisma = new PrismaClient();
// create the movieAdapter and inject it into the MovieService
const movieAdapter = new MovieAdapter(prisma);
const movieService = new MovieService(movieAdapter);

// Routes are focues on handling HTTP requests and responses
// Business logic is delegated to the MoviesService
// GET /
moviesRoute.get('/', async (req: Request, res: Response): Promise<void> => {
  const name = req.query.name;

  if (typeof name === 'string') {
    const movie = await movieService.getMovieByName(name);
    formatResponse(res, movie as GetMovieResponse);
  } else if (name) {
    formatResponse(res, { status: 400, error: 'Invalid movie name provided' });
  } else {
    const allMovies = await movieService.getMovies();
    formatResponse(res, allMovies as GetMovieResponse);
  }
});

// POST /
moviesRoute.post('/', async (req, res): Promise<void> => {
  const result = await movieService.createMovie(req.body as Movie);
  /**
   * Do Kafka stuff her
    if ('data' in result) {
      const movie = result.data;
      // produce an event
      await produceMovieEvent(movie, 'movie-created');
    }
    */
  formatResponse(res, result as CreateMovieResponse | ConflictMovieResponse);
});

// GET /:id
moviesRoute.get(
  '/:id',
  validateId as RequestHandler,
  async (req, res): Promise<void> => {
    const result = await movieService.getMovieById(Number(req.params.id));
    formatResponse(res, result as GetMovieResponse | MovieNotFoundResponse);
  }
);

// PUT /:id
moviesRoute.put('/:id', validateId as RequestHandler, async (req, res) => {
  const result = await movieService.updateMovie(
    Number(req.params.id),
    req.body
  );
  /**
   * Do Kafka stuff her
    if ('data' in result) {
      const movie = result.data;
      // produce an event
      await produceMovieEvent(movie, 'movie-created');
    }
    */
  formatResponse(
    res,
    result as
      | UpdateMovieResponse
      | MovieNotFoundResponse
      | ConflictMovieResponse
  );
});

//DELETE /:id
moviesRoute.delete(
  '/:id',
  validateId as RequestHandler,
  async (req, res): Promise<void> => {
    const movieId = Number(req.params.id);
    const movieResponse = await movieService.getMovieById(movieId);

    if ('data' in movieResponse && movieResponse.data) {
      //const movie = movieResponse.data as Movie;
      const result = await movieService.deleteMovieById(movieId);
      /**
   * Do Kafka stuff her
    if ('data' in result) {
      const movie = result.data;
      // produce an event
      await produceMovieEvent(movie, 'movie-created');
    }
    */
      formatResponse(res, result as DeleteMovieResponse);
    } else {
      //return formatResponse(res, movieResponse as MovieNotFoundResponse);
      formatResponse(res, {
        status: 404,
        error: `Movie ID: ${movieId} not found`
      });
    }
  }
);
