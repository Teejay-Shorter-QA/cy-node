import { retryableBefore } from 'cy-retryable-before'

describe('CRUD movie', () => {
  retryableBefore(() => {
    cy.api({
      method: 'GET',
      url: '/'
    })
      .its('body.message')
      .should('eq', 'Server is running')
  })

  it('log to say', () => {
    cy.log('say hello')
  })
})
