import { retryableBefore } from 'cy-retryable-before';
import spok from 'cy-spok';
import schema from '../../src/api-docs/openapi.json';
import type { Movie } from '../../src/generated/prisma/client';
import { generateMovieWithoutId } from '../../src/test-helpers/factories';
import type { OpenAPIV3_1 } from 'openapi-types';

const typedSchema: OpenAPIV3_1.Document = schema as OpenAPIV3_1.Document;

describe('CRUD movie', () => {
  const movie = generateMovieWithoutId();
  const updatedMovie = generateMovieWithoutId();
  const movieProps: Omit<Movie, 'id'> = {
    name: spok.string,
    year: spok.number,
    rating: spok.number
  };

  let tokenMessage: string;

  retryableBefore(() => {
    cy.maybeGetToken('token-session').then((token) => {
      tokenMessage = token;
    });
  });

  it('should', () => {
    cy.createMovie(tokenMessage, movie);
  });
});
