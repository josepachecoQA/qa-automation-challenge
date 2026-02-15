const { expect } = require('@playwright/test');

class SearchResultsPage {
  constructor(page) {
    this.page = page;

    // Seção principal dos resultados para sincronização da tela.
    this.containerResultados = page.locator('div.s-main-slot');

    // Itens de resultado com atributo estável para os cartões de produto.
    this.itensResultado = page.locator('[data-component-type="s-search-result"]');
  }

  // Aguarda a página de resultados ficar efetivamente pronta.
  async waitForResults() {
    await expect(this.containerResultados).toBeVisible();
    await expect(this.itensResultado.first()).toBeVisible();
  }

  // Seleciona o livro pelo título exato para evitar clique no item incorreto.
  async selectProductByExactTitle(tituloExato) {
    await this.waitForResults();

    const cardAlvo = this.itensResultado
      .filter({
        has: this.page.getByRole('heading', { name: tituloExato, exact: true })
      })
      .first();

    await expect(cardAlvo).toBeVisible();

    // Clica no link do título dentro do card localizado.
    await cardAlvo.getByRole('link', { name: tituloExato, exact: true }).first().click();

    // Aguarda novo carregamento após a navegação da listagem para a página de produto.
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Valida cenário de busca sem resultado com contingência entre variações de estrutura e texto.
  async validateNoResultsFound() {
    const semResultadosPorSecao = this.page.locator('div.s-no-result-section, [data-component-type="s-search-no-results"]');
    const semResultadosPorTexto = this.page.getByText(/Nenhum resultado para|sem resultados|No results for/i).first();

    await expect(semResultadosPorSecao.or(semResultadosPorTexto).first()).toBeVisible();
  }
}

module.exports = SearchResultsPage;
