// eslint-disable-next-line @typescript-eslint/no-require-imports
const cyDataSession = require('cypress-data-session/src/plugin');

/**
 * The collection of plugins to use with Cypress
 * @param on  `on` is used to hook into various events Cypress emits
 * @param config  `config` is the resolved Cypress config
 */
export default function plugins(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) {
  return {
    // add plugins here
    ...cyDataSession(on, config)
  };
}
