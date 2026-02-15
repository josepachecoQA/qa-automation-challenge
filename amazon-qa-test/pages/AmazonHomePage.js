const { expect } = require('@playwright/test');

class AmazonHomePage {
  constructor(page) {
    this.page = page;

    // Campo principal de busca com suporte a variações de estrutura da página.
    this.campoBusca = page.locator(
      '#twotabsearchtextbox, input[name="field-keywords"], input[aria-label="Search For"], input[aria-label="Pesquisar Amazon.com.br"]'
    ).first();

    // Botão de envio da busca como contingência quando a tecla Enter falhar.
    this.botaoEnviarBusca = page.locator('#nav-search-submit-button');

    // Botão de aceite de cookies quando o banner estiver disponível.
    this.botaoAceitarCookies = page.locator('#sp-cc-accept');
  }

  // Abre a home e aguarda os elementos essenciais da página.
  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.campoBusca).toBeVisible();
    await this.acceptCookiesIfVisible();
  }

  // Aceita cookies apenas quando o banner existe/está visível.
  async acceptCookiesIfVisible() {
    if (await this.botaoAceitarCookies.isVisible()) {
      await this.botaoAceitarCookies.click();
    }
  }

  // Executa a busca com limpeza prévia para evitar resíduos da execução anterior.
  async searchFor(nomeProduto) {
    await expect(this.campoBusca).toBeVisible();
    await this.campoBusca.click();
    await this.campoBusca.fill('');
    await this.campoBusca.fill(nomeProduto);

    // Usa a tecla Enter como ação principal por ser o fluxo mais próximo do usuário.
    await this.campoBusca.press('Enter');

    // Usa contingência de clique no botão quando a navegação por Enter não ocorrer.
    if (/\/s([/?]|$)/.test(this.page.url()) === false) {
      await this.botaoEnviarBusca.click();
    }
  }
}

module.exports = AmazonHomePage;
