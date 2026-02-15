# Desafio Técnico - QA & Automação de Testes

Este repositório consolida a solução completa da prova, cobrindo:

- **Questão 1:** testes E2E na Amazon Brasil (Playwright e Cypress)
- **Questão 2:** testes de API com Python + Requests + Pytest
- **Questão 3:** integração CI/CD com GitHub Actions

## Estrutura do repositório

```text
desafio_tecnico/
├── .github/
│   └── workflows/
│       └── qa-pipeline.yml
├── amazon-qa-test/
├── amazon-qa-test-cypress/
├── api-tests/
└── README.md
```

## Pré-requisitos

- Node.js 20+
- Python 3.11+
- Git

## Como rodar os testes localmente

### 1) Playwright (Questão 1)

Pasta: `amazon-qa-test`

```bash
cd amazon-qa-test
npm ci
npx playwright install
npm test
```

Documentação detalhada: `amazon-qa-test/README.md`

---

### 2) Cypress (Questão 1)

Pasta: `amazon-qa-test-cypress`

```bash
cd amazon-qa-test-cypress
npm ci
npm test
```

Documentação detalhada: `amazon-qa-test-cypress/README.md`

---

### 3) API Tests (Questão 2)

Pasta: `api-tests`

```bash
cd api-tests
pip install -r requirements.txt
pytest -v
```

Documentação detalhada: `api-tests/README.md`

## CI/CD (Questão 3)

O pipeline unificado está em:

- `.github/workflows/qa-pipeline.yml`

### Como o pipeline funciona

- Dispara automaticamente em `push` e `pull_request` para `main/master`
- Permite execução manual via `workflow_dispatch`
- Executa em paralelo:
  - Playwright (matriz por browser)
  - Cypress (matriz por browser)
  - API tests (matriz por versão de Python)
- Publica artefatos de execução mesmo em caso de falha (`if: always()`)

### Como visualizar relatórios no GitHub Actions

1. Abra a aba **Actions** no repositório GitHub.
2. Selecione uma execução do workflow **QA Pipeline**.
3. Vá até a seção **Artifacts**.
4. Baixe os artefatos para consultar relatórios, vídeos e screenshots.

## Itens avaliados e cobertura

- **Estrutura do código:** POM para E2E, organização por pastas e fixtures
- **Boas práticas:** asserts claras, separação de responsabilidades, documentação
- **Robustez:** cenários positivos e negativos, validações de contrato, timeout e relatórios
- **CI/CD prático:** gatilhos automáticos, paralelismo e evidências de falha

## Observação

Foram mantidas sugestões de melhoria nos READMEs de cada projeto, conforme solicitado no enunciado (item opcional).
