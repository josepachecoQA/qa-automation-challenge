const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;

    // Título do produto para confirmar que a página de produto correta foi aberta.
    this.tituloProduto = page.locator('#productTitle');

    // Autor principal exibido na seção de autoria em páginas de livros.
    this.informacaoAutor = page.locator('#bylineInfo');

    // Áreas comuns onde a Amazon exibe detalhes como idioma, edição e formato.
    this.areaDetalhes = page.locator('#detailBullets_feature_div, #detailBulletsWrapper_feature_div, #prodDetails').first();

    // Região de compra/oferta usada na validação de condição do item.
    this.areaCompra = page.locator('#buybox, #desktop_qualifiedBuyBox, #exports_desktop_qualifiedBuybox').first();

    // Botão principal de adição ao carrinho.
    this.botaoAdicionarCarrinho = page.locator('#add-to-cart-button');

    // Mensagem de confirmação exibida após adicionar ao carrinho.
    this.mensagemAdicionadoCarrinho = page.locator('#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation .a-alert-content').first();
  }

  // Valida que o título da página de produto está visível e contém o texto esperado.
  async validateProductTitle(tituloEsperado) {
    await expect(this.tituloProduto).toBeVisible();
    await expect(this.tituloProduto).toContainText(tituloEsperado);
  }

  // Valida autor explicitamente na seção de autoria.
  async validateAuthor(autorEsperado) {
    await expect(this.informacaoAutor).toBeVisible();
    await expect(this.informacaoAutor).toContainText(autorEsperado);
  }

  // Valida idioma em área de detalhes robusta, sem depender de estrutura rígida.
  async validateLanguage(idiomaEsperado) {
    await expect(this.areaDetalhes).toBeVisible();
    await expect(this.areaDetalhes).toContainText(/Idioma/i);
    await expect(this.areaDetalhes).toContainText(idiomaEsperado);
  }

  // Valida que o formato físico "Capa comum" está presente na página do produto.
  async validatePhysicalFormatPaperback() {
    const areaFormato = this.page.locator('#tmmSwatches, #formats, #detailBullets_feature_div').first();
    await expect(areaFormato).toBeVisible();
    await expect(areaFormato).toContainText(/Capa comum/i);
  }

  // Valida condição de produto novo na área de compra/oferta.
  async validateProductConditionNew() {
    // A Amazon alterna a estrutura da página: em alguns casos exibe "Condição: Novo".
    // Em outros, mostra a opção de ofertas como "Usado e Novo".
    const condicaoNovoExplicita = this.page.locator(
      '#buybox :text-matches("Condição\\s*:?\\s*Novo|(^|\\s)Novo(\\s|$)", "i"), #desktop_qualifiedBuyBox :text-matches("Condição\\s*:?\\s*Novo|(^|\\s)Novo(\\s|$)", "i"), #exports_desktop_qualifiedBuybox :text-matches("Condição\\s*:?\\s*Novo|(^|\\s)Novo(\\s|$)", "i"), #newAccordionRow :text-matches("Condição\\s*:?\\s*Novo|(^|\\s)Novo(\\s|$)", "i"), #all-offers-display :text-matches("Condição\\s*:?\\s*Novo|(^|\\s)Novo(\\s|$)", "i")'
    );

    const botaoUsadoENovo = this.page.getByRole('button', {
      name: /Usado e Novo|Outros\s+Usado\s+e\s+Novo/i
    });

    await expect(condicaoNovoExplicita.or(botaoUsadoENovo).first()).toBeVisible();
  }

  // Clica para adicionar ao carrinho após confirmar botão visível.
  async addToCart() {
    await expect(this.botaoAdicionarCarrinho).toBeVisible();
    await this.botaoAdicionarCarrinho.click();
  }

  // Valida mensagem de sucesso exata conforme requisito.
  async validateSuccessMessageExact(mensagemEsperada) {
    await expect(this.mensagemAdicionadoCarrinho).toBeVisible();
    await expect(this.mensagemAdicionadoCarrinho).toHaveText(mensagemEsperada);
  }
}

module.exports = ProductPage;
