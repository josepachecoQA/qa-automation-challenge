class AmazonHomePage {
  // Abre a home e aguarda os elementos essenciais da página.
  open() {
    cy.visit('/');
    this.getSearchInput().should('be.visible');
    this.acceptCookiesIfVisible();
  }

  // Retorna campo de busca com suporte a variações de layout.
  getSearchInput() {
    return cy
      .get('#twotabsearchtextbox, input[name="field-keywords"], input[aria-label="Search For"], input[aria-label="Pesquisar Amazon.com.br"]')
      .filter(':visible')
      .first();
  }

  // Aceita cookies apenas quando o banner estiver visível.
  acceptCookiesIfVisible() {
    cy.get('body').then(($body) => {
      const botaoAceitarCookies = $body.find('#sp-cc-accept:visible');
      if (botaoAceitarCookies.length) {
        cy.wrap(botaoAceitarCookies).click();
      }
    });
  }

  // Executa a busca com limpeza prévia para evitar resíduos da execução anterior.
  searchFor(termoBusca) {
    this.getSearchInput().clear().type(termoBusca).type('{enter}');

    // Usa contingência de clique no botão quando a navegação por Enter não ocorrer.
    cy.location('pathname').then((caminho) => {
      if (!caminho.startsWith('/s')) {
        cy.get('#nav-search-submit-button, button[type="submit"]')
          .filter(':visible')
          .first()
          .click();
      }
    });
  }
}

module.exports = AmazonHomePage;
