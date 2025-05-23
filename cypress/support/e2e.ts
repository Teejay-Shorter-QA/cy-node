import './commands';
import './get-token';
import 'cypress-map';
import '@bahmutov/cy-api';
import type { CreateMovieRequest, UpdateMovieRequest } from '../../src/@types';

const commonHeaders = (token: string) => ({
  Authorization: token
});

//#region API - Movies

Cypress.Commands.add(
  'createMovie',
  (token: string, movieData: CreateMovieRequest, allowedToFail = false) => {
    cy.log('**createMovie**');
    return cy.api({
      method: 'POST',
      url: '/movies',
      body: movieData,
      headers: commonHeaders(token),
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail
    });
  }
);

Cypress.Commands.add(
  'deleteMovie',
  (token: string, id: number, allowedToFail = false) => {
    cy.log(`**deleteMovie: ${id}**`);
    return cy.api({
      method: 'DELETE',
      url: `/movies/${id}`,
      headers: commonHeaders(token),
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail
    });
  }
);

Cypress.Commands.add(
  'getMovieById',
  (token: string, id: number, allowedToFail = false) => {
    cy.log(`**getMovieById: ${id}**`);
    return cy.api({
      method: 'GET',
      url: `/movies/${id}`,
      headers: commonHeaders(token),
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail
    });
  }
);

Cypress.Commands.add(
  'getMovieByName',
  (token: string, name: string, allowedToFail = false) => {
    cy.log(`**getMovieByName: ${name}**`);
    return cy.api({
      method: 'GET',
      url: '/movies',
      qs: { name: name },
      headers: commonHeaders(token),
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail
    });
  }
);

Cypress.Commands.add('getMovies', (token: string, allowedToFail = false) => {
  cy.log('**getAllMovies**');
  return cy.api({
    method: 'GET',
    url: '/movies',
    headers: commonHeaders(token),
    retryOnStatusCodeFailure: !allowedToFail,
    failOnStatusCode: !allowedToFail
  });
});

Cypress.Commands.add(
  'updateMovie',
  (
    token: string,
    id: number,
    movieData: UpdateMovieRequest,
    allowedToFail = false
  ) => {
    cy.log(`**updateMovie with ID: ${id}**`);
    return cy.api({
      method: 'PUT',
      url: `/movies/${id}`,
      body: movieData,
      headers: commonHeaders(token),
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail
    });
  }
);

//#endregion API - Movies
