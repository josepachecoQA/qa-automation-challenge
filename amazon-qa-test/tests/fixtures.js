const base = require('@playwright/test');

// Estrutura de suporte customizada do projeto.
// Centraliza o aquecimento de navegação para reduzir instabilidade
// no primeiro acesso à Amazon em qualquer cenário futuro.
const test = base.test.extend({
  page: async ({ page }, use) => {
    // Navegação inicial leve (aquecimento): ajuda a estabilizar o
    // primeiro carregamento antes do fluxo principal do teste.
    await page.goto('/', { waitUntil: 'commit' });
    await use(page);
  }
});

module.exports = {
  test,
  expect: base.expect
};
