class SearchResultsPage {
  // Aguarda a página de resultados ficar efetivamente pronta.
  waitForResults() {
    cy.get('div.s-main-slot, [data-component-type="s-search-results"]')
      .filter(':visible')
      .first()
      .should('be.visible');
  }

  // Seleciona o livro pelo título exato para evitar clique no item incorreto.
  selectProductByExactTitle(tituloExato) {
    this.waitForResults();

    // A Amazon pode variar estrutura de título e link entre layouts.
    // Localiza o card de resultado com o texto alvo e clica no link do título.
    cy.contains('[data-component-type="s-search-result"]', tituloExato, { timeout: 25000 })
      .should('be.visible')
      .within(() => {
        cy.contains('h2 a, a', tituloExato)
          .first()
          .should('be.visible')
          .click();
      });
  }

  // Valida cenário de busca sem resultado com contingência entre variações de layout e texto.
  validateNoResultsFound() {
    cy.get('body').then(($body) => {
      const secaoSemResultados = $body.find('div.s-no-result-section:visible, [data-component-type="s-search-no-results"]:visible');

      if (secaoSemResultados.length) {
        cy.wrap(secaoSemResultados.first()).should('be.visible');
      } else {
        cy.contains(/Nenhum resultado para|sem resultados|No results for/i).should('be.visible');
      }
    });
  }

}

module.exports = SearchResultsPage;
