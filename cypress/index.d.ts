//import type { Movie } from '../../src/generated/prisma/client';
import type {
  CreateMovieRequest,
  CreateMovieResponse,
  DeleteMovieResponse,
  GetMovieResponse,
  UpdateMovieRequest,
  UpdateMovieResponse
} from '../src/@types';
import type { OpenAPIV3_1 } from 'openapi-types';

export {};

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      //#region API

      /**
       * Check if token exists, if not, fetch it and store it in the session.
       * @param sessionName - The name of the session to be used for storing the token.
       */
      maybeGetToken(sessionName: string): Chainable<string>;

      /**
       * Validates the response body against the provided schema.
       * @param {OpenAPIV3_1.SchemaObject } schema - OpenAPI schema to validate against.
       * @param options - Endpoint and method information for the schema, with options for path and status.
       * @example
       * ```
       * cy.validateSchema(schema, {
       *   endpoint: '/movies',
       *   method: 'GET'
       * });
       * ```
       * You can also specify the path and status:
       * ```
       * cy.validateSchema(schema, {
       *   endpoint: '/movies',
       *   method: 'POST',
       *   status: 201 // Defaults to 200 if not provided
       * )};
       * ```
       */
      validateSchema(
        schema: OpenAPIV3_1.Document,
        options: {
          endpoint: string;
          method: string;
          path?: string;
          status?: string | number;
        }
      ): Chainable<Subject>;

      //#region API - Movies

      /**
       * Create a new movie
       * @param {string} token - The token to be used for authentication.
       * @param {CreateMovieRequest} movieData - Object of movie data to send.
       * @param {boolean} allowedToFail - Whether to allow the request to fail.
       * @example
       * ```
       * cy.createMovie(token, { name: 'Inception', year: 2010, rating: 7.5 })
       * ```
       */
      createMovie(
        token: string,
        movieData: CreateMovieRequest,
        allowedToFail?: boolean
      ): Chainable<Response<CreateMovieResponse> & Messages>;

      /**
       * Delete a movie by ID
       * @param {string} token - The token to be used for authentication.
       * @param {number} id - Movie ID to search for.
       * @param {boolean} allowedToFail - Whether to allow the request to fail.
       * @example
       * ```
       * cy.deleteMovie(token, 1)
       * ```
       */
      deleteMovie(
        token: string,
        id: number,
        allowedToFail?: boolean
      ): Chainable<Response<DeleteMovieResponse> & Messages>;

      /**
       * Get a movie by ID
       * @param {string} token - The token to be used for authentication.
       * @param {number} id - Movie ID to search for.
       * @param {boolean} allowedToFail - Whether to allow the request to fail.
       * @example
       * ```
       * cy.getMovieById(token, 1)
       * ```
       */
      getMovieById(
        token: string,
        id: number,
        allowedToFail?: boolean
      ): Chainable<Response<GetMovieResponse> & Messages>;

      /**
       * Get a movie by name
       * @param {string} token - The token to be used for authentication.
       * @param {string} name - Movie name to search for.
       * @param {boolean} allowedToFail - Whether to allow the request to fail.
       * @example
       * ```
       * cy.getMovieByName(token, 'Inception')
       * ```
       */
      getMovieByName(
        token: string,
        name: string,
        allowedToFail?: boolean
      ): Chainable<Response<GetMovieResponse> & Messages>;

      /**
       * Get a list of all movies
       * @param {string} token - The token to be used for authentication.
       * @param {boolean} allowedToFail - Whether to allow the request to fail.
       * @example
       * ```
       * cy.getMovies(token)
       * ```
       */
      getMovies(
        token: string,
        allowedToFail?: boolean
      ): Chainable<Response<GetMovieResponse> & Messages>;

      /**
       * Update an existing movie with new data
       * @param {string} token - The token to be used for authentication.
       * @param {number} id - Movie ID to search for.
       * @param {CreateMovieRequest} movieData - Object of movie data to send.
       * @param {boolean} allowedToFail - Whether to allow the request to fail.
       * @example
       * ```
       * cy.updateMovie(token, 1, { rating: 3.2 })
       * ```
       */
      updateMovie(
        token: string,
        id: number,
        movieData: UpdateMovieRequest,
        allowedToFail?: boolean
      ): Chainable<Response<UpdateMovieResponse> & Messages>;

      //#endregion API - Movies
      //#endregion API

      //#region Plugins

      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.skipOn('localhost')` */
      skipOn(
        nameOrFlag: string | boolean | (() => boolean),
        cb?: () => void
      ): Chainable<Subject>;

      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.onlyOn('localhost')` */
      onlyOn(
        nameOrFlag: string | boolean | (() => boolean),
        cb?: () => void
      ): Chainable<Subject>;

      //#endregion Plugins
    }
  }
}
