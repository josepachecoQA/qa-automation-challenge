// Configuração central do Playwright Test para execução local e em CI.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Diretório onde os testes estão armazenados.
  testDir: './tests',

  // Tempo máximo por teste.
  timeout: 60 * 1000,

  // Tempo máximo por verificação.
  expect: {
    timeout: 15 * 1000
  },

  // Nova tentativa ajuda a reduzir falso-negativo por oscilação natural do ambiente.
  // Em CI usa 2 tentativas; local usa 1 para manter robustez sem mascarar problemas.
  retries: process.env.CI ? 2 : 1,

  // Execução paralela segura entre arquivos.
  fullyParallel: true,

  // Evita deixar test.only passar despercebido no CI.
  forbidOnly: !!process.env.CI,

  // Reporter em lista no terminal + HTML para análise detalhada.
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    // URL base da aplicação testada.
    baseURL: 'https://www.amazon.com.br',

    // Execução sem interface gráfica por padrão (ideal para pipelines e execução consistente).
    headless: true,

    // Evidências úteis para troubleshooting.
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',

    // Timeout de navegação para páginas mais pesadas.
    navigationTimeout: 45 * 1000,

    // Define locale em pt-BR para estabilizar textos esperados em português.
    locale: 'pt-BR'
  },

  // Projetos para execução entre navegadores.
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    }
  ]
});
