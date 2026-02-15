const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // URL base da aplicação testada.
    baseUrl: 'https://www.amazon.com.br',

    // Mantém os testes dentro da pasta tests/ para seguir o mesmo padrão do projeto Playwright.
    specPattern: 'tests/**/*.cy.js',

    // Hook de setup para reporter e extensões futuras.
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },

    // Isolamento padrão do Cypress entre testes.
    testIsolation: true,

    // Retry para reduzir falso-negativo por oscilação de renderização da Amazon.
    retries: {
      runMode: 2,
      openMode: 1
    },

    // Timeout de comandos/assertivas para páginas pesadas.
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 30000,

    // Mantém vídeos e screenshots para troubleshooting.
    video: true,
    screenshotOnRunFailure: true
  },

  // Reporter HTML para visualização amigável no pós-execução.
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    overwrite: false,
    html: true,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true
  }
});
