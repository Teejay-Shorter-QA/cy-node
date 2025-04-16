import { retryableBefore } from 'cy-retryable-before';

describe('CRUD movie', () => {
  let tokenMessage: string;
  retryableBefore(() => {
    cy.api({
      method: 'GET',
      url: '/'
    })
      .its('body.message')
      .should('eq', 'Server is running!');
    cy.maybeGetToken('token-session').then((token) => {
      tokenMessage = token;
    });
  });

  it('should', () => {
    cy.log(tokenMessage);
  });
});
