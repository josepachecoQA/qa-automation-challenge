# Amazon QA Test - Playwright (JavaScript)

Projeto de automação E2E com Playwright para validar o fluxo de busca e adição ao carrinho de um livro específico na Amazon Brasil.

## História do usuário

Como pessoa compradora,
quero buscar um livro específico na Amazon Brasil,
para confirmar os detalhes corretos do produto e adicioná-lo ao carrinho com sucesso.

## Critérios de aceite

- Acessar `https://www.amazon.com.br/`
- Buscar por `AI Engineering: Building Applications with Foundation Models`
- Selecionar o produto correto na listagem
- Validar antes da compra:
  - Autor: `Chip Huyen`
  - Idioma: `Inglês`
  - Formato físico: `Capa comum`
  - Condição: `Novo`
- Adicionar ao carrinho
- Validar mensagem exata de sucesso: `Adicionado ao carrinho`

## Casos de teste

### CT01 - Busca e seleção do livro correto
**Pré-condição:** Site da Amazon Brasil disponível.

**Passos:**
1. Acessar a home.
2. Buscar o título exato do livro.
3. Selecionar o resultado com título exato.

**Resultado esperado:**
- A página do produto correto é aberta.

### CT02 - Validação dos dados do produto antes da compra
**Pré-condição:** Estar na página do livro correto.

**Passos:**
1. Validar autor.
2. Validar idioma.
3. Validar formato.
4. Validar condição.

**Resultado esperado:**
- Todos os atributos correspondem ao esperado.

### CT03 - Adição ao carrinho com confirmação exata
**Pré-condição:** Produto válido aberto na PDP.

**Passos:**
1. Clicar em adicionar ao carrinho.
2. Validar mensagem de sucesso.

**Resultado esperado:**
- A mensagem deve ser exatamente: `Adicionado ao carrinho`.

### CT04 - Busca com termo inexistente (caminho negativo)
**Pré-condição:** Site da Amazon Brasil disponível.

**Passos:**
1. Acessar a home.
2. Buscar um termo único e inexistente.
3. Validar feedback de ausência de resultados.

**Resultado esperado:**
- A página deve exibir mensagem/seção de nenhum resultado encontrado.

## Estrutura do projeto

```bash
amazon-qa-test/
├── pages/
│   ├── AmazonHomePage.js
│   ├── SearchResultsPage.js
│   └── ProductPage.js
├── tests/
│   └── amazon-add-to-cart.spec.js
├── playwright.config.js
├── package.json
└── README.md
```

## Como instalar dependências

```bash
npm install
npx playwright install
```

## Como rodar os testes

```bash
# Execução padrão (headless)
npm test

# Execução com browser visível
npm run test:headed

# Execução em modo debug
npm run test:debug

# Abrir relatório HTML após execução
npm run test:report

# Executar apenas suíte smoke
npm run test:smoke

# Executar suíte regression
npm run test:regression

# Executar por navegador/projeto
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Tags de execução

- `@smoke`: cobre o fluxo crítico de compra do livro.
- `@regression`: cobre fluxo principal + cenário negativo de busca.

## Boas práticas aplicadas

- Uso de `@playwright/test` com `async/await`
- Espera automática com `expect(...).toBeVisible()` e sem `wait` fixo
- Seletores mais estáveis (IDs e estruturas recorrentes da Amazon)
- Padrão POM para separar responsabilidades
- Assertiva exata para mensagem final com `toHaveText()`
- Configuração com retry, relatório HTML e evidências (trace/screenshot/video)

## Pronto para CI (GitHub Actions)

O repositório inclui workflow unificado em `.github/workflows/qa-pipeline.yml` com:
- instalação de dependências
- instalação dos browsers do Playwright
- execução dos testes em matriz de navegadores (`chromium`, `firefox`, `webkit`)
- publicação de artefato do relatório

### Como visualizar artefatos no GitHub Actions

1. Acesse a aba **Actions** do repositório.
2. Abra a execução do workflow **QA Pipeline** (ou workflow específico).
3. No final da página da execução, localize **Artifacts**.
4. Baixe o artefato desejado (ex.: `playwright-report-*`) e abra o relatório HTML.

## Sugestões de melhoria no processo de automação

1. Adicionar tags por criticidade (`@smoke`, `@regression`) para execução segmentada.
2. Incluir estratégia de dados de teste versionados para múltiplos produtos/livros.
3. Implementar fixtures customizadas para sessão, geolocalização e feature flags.
4. Integrar relatório avançado (ex.: Allure) para evidências de negócio.
5. Executar em matriz de navegadores (Chromium, Firefox, WebKit) no CI.
6. Adicionar monitoramento de flakiness com dashboard de estabilidade.

## Benchmark de execução

Data da medição: 13/02/2026

| Projeto | Cenário | Modo | Comando | Resultado | Tempo |
|---|---|---|---|---|---|
| Playwright | Regression (2 testes) | Headless | npm run test:regression -- --project=chromium --workers=1 | 2 passed | 20.1s |
| Playwright | Regression (2 testes) | Headed | npx playwright test --grep "@regression" --project=chromium --workers=1 --headed | 2 passed | 22.3s |
| Cypress | Spec principal (2 testes) | Headed | npm run test:headed | 2 passing | 55s |

Resumo: na medição realizada, o Playwright executou o cenário de referência em menor tempo total que o Cypress para este fluxo.
