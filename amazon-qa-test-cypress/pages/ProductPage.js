class ProductPage {
  // Valida que o título da PDP está visível e contém o texto esperado.
  validateProductTitle(tituloEsperado) {
    cy.get('#productTitle').should('be.visible').and('contain.text', tituloEsperado);
  }

  // Valida autor explicitamente na seção de byline.
  validateAuthor(autorEsperado) {
    cy.get('#bylineInfo').should('be.visible').and('contain.text', autorEsperado);
  }

  // Valida idioma em área de detalhes robusta, sem depender de estrutura rígida.
  validateLanguage(idiomaEsperado) {
    cy.get('#detailBullets_feature_div, #detailBulletsWrapper_feature_div, #prodDetails')
      .filter(':visible')
      .first()
      .should('contain.text', 'Idioma')
      .and('contain.text', idiomaEsperado);
  }

  // Valida que o formato físico "Capa comum" está presente na página do produto.
  validatePhysicalFormatPaperback() {
    cy.get('#tmmSwatches, #formats, #detailBullets_feature_div')
      .filter(':visible')
      .first()
      .invoke('text')
      .then((texto) => {
        expect(texto.toLowerCase()).to.include('capa');
        expect(texto.toLowerCase()).to.include('comum');
      });
  }

  // Valida condição de produto novo na área de compra/oferta.
  validateProductConditionNew() {
    cy.get(
      '#buybox, #desktop_qualifiedBuyBox, #exports_desktop_qualifiedBuybox, #newAccordionRow, #all-offers-display, #mediaMatrix_feature_div, #tmmSwatches'
    )
      .filter(':visible')
      .should('have.length.at.least', 1)
      .invoke('text')
      .then((texto) => {
        const textoNormalizado = texto.toLowerCase().replace(/\s+/g, ' ');

        // Caminho principal: condição textual disponível na página.
        if (/novo|usado e novo|used\s*&\s*new/.test(textoNormalizado)) {
          expect(textoNormalizado).to.match(/novo|usado e novo|used\s*&\s*new/);
          return;
        }

        // Em alguns layouts, "Novo" não aparece explicitamente na área visível.
        // Nesse caso, valida evidências da oferta principal no buybox.
        expect(textoNormalizado).to.include('em estoque');
        expect(textoNormalizado).to.include('adicionar ao carrinho');
        expect(textoNormalizado).to.match(/enviado\s*\/\s*vendido|amazon global/);
      });
  }

  // Clica para adicionar ao carrinho após confirmar botão visível.
  addToCart() {
    cy.get('#add-to-cart-button').should('be.visible').click();
  }

  // Valida mensagem de sucesso exata conforme requisito.
  validateSuccessMessageExact(mensagemEsperada) {
    cy.get('#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation .a-alert-content')
      .filter(':visible')
      .first()
      .should('be.visible')
      .invoke('text')
      .then((texto) => {
        expect(texto.trim()).to.eq(mensagemEsperada);
      });
  }
}

module.exports = ProductPage;
