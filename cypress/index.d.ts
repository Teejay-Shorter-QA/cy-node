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
