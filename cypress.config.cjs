const { defineConfig } = require('cypress');
const { viteDevServer } = require('@cypress/vite-dev-server');

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: require('./vite.config'),
    },
    indexHtmlFile: 'cypress/support/component-index.html',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
});
