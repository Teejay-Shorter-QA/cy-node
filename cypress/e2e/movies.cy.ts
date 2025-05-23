import 'cypress-ajv-schema-validator';
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

  it('should create a movie', () => {
    cy.createMovie(tokenMessage, movie)
      .validateSchema(typedSchema, {
        endpoint: '/movies',
        method: 'POST'
      })
      .its('body')
      .should(
        spok({
          status: 200,
          data: movieProps
        })
      );
  });

  it('should get all movies', () => {
    cy.getMovies(tokenMessage)
      .validateSchema(typedSchema, {
        endpoint: '/movies',
        method: 'GET'
      })
      .its('body')
      .should(
        spok({
          status: 200,
          data: (moviesArray: Movie[]) =>
            moviesArray.map(
              spok({
                id: spok.number,
                ...movieProps
              })
            )
        })
      );
  });

  it('should get movie by id', () => {
    // Create a new movie and save its id
    cy.createMovie(tokenMessage, generateMovieWithoutId())
      .its('body.data.id')
      .then((id: number) => {
        // Get the newly creted movie by id
        cy.getMovieById(tokenMessage, id)
          .validateSchema(typedSchema, {
            endpoint: '/movies/{id}',
            method: 'GET'
          })
          .its('body')
          .should(
            spok({
              status: 200,
              data: movieProps
            })
          );
      });
  });

  it('should get movie by name', () => {
    // Create a new movie and save its id
    cy.createMovie(tokenMessage, generateMovieWithoutId())
      .its('body.data.name')
      .then((name: string) => {
        // Get the newly creted movie by id
        cy.getMovieByName(tokenMessage, name)
          .validateSchema(typedSchema, {
            endpoint: '/movies',
            method: 'GET'
          })
          .its('body')
          .should(
            spok({
              status: 200,
              data: movieProps
            })
          );
      });
  });

  it('should update a movie', () => {
    // Create a new movie and save its id
    cy.createMovie(tokenMessage, generateMovieWithoutId())
      .its('body.data.id')
      .then((id: number) => {
        // Get the newly creted movie by id
        cy.updateMovie(tokenMessage, id, updatedMovie)
          .validateSchema(typedSchema, {
            endpoint: '/movies/{id}',
            method: 'PUT',
            status: 200
          })
          .its('body')
          .should(
            spok({
              status: 200,
              data: { ...movieProps, id }
            })
          );
      });
  });

  it('should delete a movie', () => {
    // Create a new movie and save its id
    const movieData = generateMovieWithoutId();
    cy.createMovie(tokenMessage, movieData)
      .its('body.data.id')
      .then((id: number) => {
        // Get the newly creted movie by id
        cy.deleteMovie(tokenMessage, id)
          .validateSchema(typedSchema, {
            endpoint: '/movies/{id}',
            method: 'DELETE',
            status: 200
          })
          .its('body')
          .should(
            spok({
              status: 200,
              message: `Movie ID: ${id} deleted successfully`
            })
          );
      });
    cy.getMovies(tokenMessage)
      .findOne({ name: movieData.name })
      .should('not.exist');
  });

  it('should handle deleting a non-existant movie', () => {
    cy.deleteMovie(tokenMessage, 999, true)
      .validateSchema(typedSchema, {
        endpoint: '/movies/{id}',
        method: 'DELETE',
        status: 404
      })
      .its('body')
      .should(
        spok({
          status: 404,
          error: 'Movie ID: 999 not found'
        })
      );
  });
});
