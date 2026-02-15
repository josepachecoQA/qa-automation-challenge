const { test, expect } = require('./fixtures');
const AmazonHomePage = require('../pages/AmazonHomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const ProductPage = require('../pages/ProductPage');

test.describe('Amazon Brasil - Adicionar livro ao carrinho', () => {
  test('deve buscar o livro correto, validar dados e adicionar ao carrinho @smoke @regression', async ({ page }) => {
    // Dados centralizados para facilitar manutenção e leitura do cenário.
    const livroAlvo = {
      titulo: 'AI Engineering: Building Applications with Foundation Models',
      autor: 'Chip Huyen',
      idioma: 'Inglês',
      formato: 'Capa comum',
      condicao: 'Novo',
      mensagemSucesso: 'Adicionado ao carrinho'
    };

    // Instancia as páginas do POM para separar responsabilidades.
    const paginaInicial = new AmazonHomePage(page);
    const paginaResultados = new SearchResultsPage(page);
    const paginaProduto = new ProductPage(page);

    // Etapa 1: acessar a home da Amazon Brasil.
    await paginaInicial.open();

    // Etapa 2: buscar o livro alvo com título exato.
    await paginaInicial.searchFor(livroAlvo.titulo);

    // Etapa 3: selecionar nos resultados o produto correspondente ao título exato.
    await paginaResultados.selectProductByExactTitle(livroAlvo.titulo);

    // Etapa 4: validar que a página de produto aberta é a do livro esperado.
    await paginaProduto.validateProductTitle(livroAlvo.titulo);

    // Etapa 5: validar explicitamente o autor.
    await paginaProduto.validateAuthor(livroAlvo.autor);

    // Etapa 6: validar idioma da edição em inglês.
    await paginaProduto.validateLanguage(livroAlvo.idioma);

    // Etapa 7: validar formato físico (capa comum).
    await paginaProduto.validatePhysicalFormatPaperback();

    // Etapa 8: validar condição do produto como novo.
    await paginaProduto.validateProductConditionNew();

    // Etapa 9: adicionar ao carrinho.
    await paginaProduto.addToCart();

    // Etapa 10: validar texto exato de confirmação conforme requisito.
    await paginaProduto.validateSuccessMessageExact(livroAlvo.mensagemSucesso);
  });

  test('deve exibir mensagem de nenhum resultado para busca inexistente @regression', async ({ page }) => {
    const paginaInicial = new AmazonHomePage(page);
    const paginaResultados = new SearchResultsPage(page);

    // Gera termo com baixa probabilidade de retorno para validar caminho negativo.
    const buscaInexistente = `PLAYWRIGHT_NO_RESULT_${Date.now()}_XYZ`;

    await paginaInicial.open();
    await paginaInicial.searchFor(buscaInexistente);

    // Garante que a consulta foi enviada para a busca.
    await expect(page).toHaveURL(/\/s([/?]|$)/);

    // Valida explicitamente a ausência de resultados.
    await paginaResultados.validateNoResultsFound();
  });
});
