# Testes de API - JSONPlaceholder (/posts)

## Descrição do projeto
Este projeto contém testes automatizados de API para o endpoint público `https://jsonplaceholder.typicode.com/posts`, usando Python com `requests` e execução via `pytest`.

O foco é validar comportamento funcional, estrutura básica da resposta (esquema), tipos de dados e códigos de status HTTP com testes claros e organizados.

## Tecnologias utilizadas
- Python 3
- pytest
- requests

## Estrutura do projeto
```text
api-tests/
├── tests/
│   └── test_posts.py
├── pytest.ini
├── requirements.txt
└── README.md
```

## Como instalar dependências
1. Acesse a pasta do projeto:
   ```bash
   cd api-tests
   ```
2. (Opcional) Crie e ative um ambiente virtual:
   ```bash
   python -m venv .venv
   # Windows PowerShell
   .venv\Scripts\Activate.ps1
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

## Como executar os testes
Na pasta `api-tests`, execute:

```bash
pytest -v
```

Para executar apenas cenários essenciais (smoke):

```bash
pytest -m smoke -v
```

Para executar apenas cenários de contrato e borda:

```bash
pytest -m contrato -v
```

Observação: o projeto já possui configuração padrão no `pytest.ini` (incluindo timeout global de `15s` por teste).
Também está habilitada a geração automática de relatório HTML em `reports/report.html` a cada execução, com tema visual moderno definido em `reports/estilo-relatorio.css`.

## Cenários implementados
1. **GET /posts**
   - Valida código de status `200`
   - Valida que a resposta é uma lista
   - Valida que a lista contém `100` registros
   - Valida esquema básico e tipos de cada item:
     - `userId` (int)
     - `id` (int)
     - `title` (string)
     - `body` (string)

2. **GET /posts/1**
   - Valida código de status `200`
   - Valida que o `id` retornado é `1`
   - Valida esquema e tipos dos campos

3. **POST /posts**
   - Envia payload de criação com massa aleatória
   - Valida código de status `201`
   - Valida presença de `id` na resposta
   - Valida que o `id` retornado não existe na lista atual de `/posts` (unicidade)
   - Valida que os dados retornados correspondem ao payload enviado

4. **DELETE /posts/1**
   - Valida código de status `200` ou `204`

5. **GET /posts/9999 (negativo)**
   - Valida código de status `404`
   - Valida retorno de objeto vazio (`{}`)

6. **POST /posts com payload inválido (negativo de negócio)**
   - Envia payload com tipos incorretos
   - Documenta o comportamento real da API simulada (mock), que retorna `201`
   - Valida presença de `id` e espelhamento dos campos enviados

7. **Contrato HTTP - GET /posts**
   - Valida cabeçalho `Content-Type` contendo `application/json`

8. **Filtro por query string - GET /posts?userId=1**
   - Valida código de status `200`
   - Valida retorno de `10` registros
   - Valida que todos os itens possuem `userId = 1`

9. **Bordas de rota por ID - GET /posts/{id}**
   - Valida `404` para IDs `0`, `-1` e `abc`
   - Valida corpo vazio (`{}`) para esses casos

10. **Desempenho básico - GET /posts**
   - Valida tempo de resposta abaixo de `5000 ms` (limite conservador)

## Boas práticas aplicadas
- Uso de constante `BASE_URL`
- Reutilização de sessão HTTP com fixture do `pytest`
- Função auxiliar para validação de esquema e tipos
- Nomes de testes descritivos
- Asserções objetivas e mensagens claras
- Configuração centralizada de execução no `pytest.ini`
- Segmentação da suíte por marcadores (`smoke` e `contrato`)
- Relatório HTML automático com `pytest-html`
- Código limpo e legível com comentários explicativos

## Sugestões de melhorias futuras
- Validar payload inválido com regras estritas em uma API real (não mock)
- Validar cabeçalhos relevantes (ex.: `Content-Type`)
- Publicar relatório HTML como artefato no CI
- Separar configurações por ambiente e parametrizar `BASE_URL`

## Pronto para CI (GitHub Actions)

O repositório inclui workflow unificado em `.github/workflows/qa-pipeline.yml` com:
- instalação de dependências Python
- execução dos testes de API via `pytest -v`
- publicação do relatório HTML como artefato

## Como visualizar artefatos no GitHub Actions

1. Acesse a aba **Actions** do repositório.
2. Abra a execução do workflow **QA Pipeline**.
3. No final da página da execução, localize **Artifacts**.
4. Baixe o artefato `api-report-*` e abra o `report.html`.
