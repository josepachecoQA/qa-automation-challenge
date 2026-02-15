const AmazonHomePage = require('../pages/AmazonHomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const ProductPage = require('../pages/ProductPage');

describe('Amazon Brasil - Adicionar livro ao carrinho (Cypress)', () => {
  it('deve buscar o livro correto, validar dados e adicionar ao carrinho', () => {
    // Dados centralizados para facilitar manutenção e leitura do cenário.
    const livroAlvo = {
      titulo: 'AI Engineering: Building Applications with Foundation Models',
      autor: 'Chip Huyen',
      idioma: 'Inglês',
      formato: 'Capa comum',
      condicao: 'Novo',
      mensagemSucesso: 'Adicionado ao carrinho'
    };

    const paginaInicial = new AmazonHomePage();
    const paginaResultados = new SearchResultsPage();
    const paginaProduto = new ProductPage();

    // Etapa 1: acessar a home da Amazon Brasil.
    paginaInicial.open();

    // Etapa 2: buscar o livro alvo com título exato.
    paginaInicial.searchFor(livroAlvo.titulo);

    // Etapa 3: selecionar nos resultados o produto correspondente ao título exato.
    paginaResultados.selectProductByExactTitle(livroAlvo.titulo);

    // Etapa 4: validar que a PDP aberta é a do livro esperado.
    paginaProduto.validateProductTitle(livroAlvo.titulo);

    // Etapa 5: validar explicitamente o autor.
    paginaProduto.validateAuthor(livroAlvo.autor);

    // Etapa 6: validar idioma da edição em inglês.
    paginaProduto.validateLanguage(livroAlvo.idioma);

    // Etapa 7: validar formato físico (capa comum).
    paginaProduto.validatePhysicalFormatPaperback();

    // Etapa 8: validar condição do produto como novo.
    paginaProduto.validateProductConditionNew();

    // Etapa 9: adicionar ao carrinho.
    paginaProduto.addToCart();

    // Etapa 10: validar texto exato de confirmação conforme requisito.
    paginaProduto.validateSuccessMessageExact(livroAlvo.mensagemSucesso);
  });

  it('deve exibir feedback de ausência de resultados para termo inexistente', () => {
    const paginaInicial = new AmazonHomePage();
    const paginaResultados = new SearchResultsPage();

    // Gera termo com baixa probabilidade de retorno para validar caminho negativo.
    const buscaInexistente = `CYPRESS_NO_RESULT_${Date.now()}_XYZ`;

    paginaInicial.open();
    paginaInicial.searchFor(buscaInexistente);

    // Garante que a consulta foi enviada para a busca.
    cy.location('pathname').should('match', /^\/s(\/|$)/);

    // Valida explicitamente a ausência de resultados.
    paginaResultados.validateNoResultsFound();
  });
});
