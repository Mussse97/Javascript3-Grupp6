// Den här filen är en Cypress-konfigurationsfil som definierar inställningar för 
// komponenttestning med Vite som bundler. Den specificerar hur Cypress ska köra 
// komponenttester, inklusive vilken HTML-fil som ska användas som index och var 
// testfilerna finns.
const { defineConfig } = require('cypress');
const { viteDevServer } = require('@cypress/vite-dev-server');

// Importerar Vite-konfigurationen från en separat fil
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
