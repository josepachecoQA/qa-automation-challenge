import requests
import pytest
from random import randint
from uuid import uuid4

BASE_URL = "https://jsonplaceholder.typicode.com"
ENDPOINT_POSTS = f"{BASE_URL}/posts"
TIMEOUT = 10
TEMPO_MAXIMO_MS = 5000


@pytest.fixture(scope="session")
def sessao_api():
    """Cria uma sessão HTTP reutilizável para evitar repetição de configuração."""
    session = requests.Session()
    yield session
    session.close()


def validar_esquema_post(post, posicao=None):
    """
    Valida o esquema básico esperado para um item de /posts.

    Campos obrigatórios:
    - userId: int
    - id: int
    - title: str
    - body: str
    """
    campos_obrigatorios = {"userId", "id", "title", "body"}

    # Gera contexto para facilitar depuração caso falhe em uma lista grande.
    contexto = f" no item #{posicao}" if posicao is not None else ""

    assert isinstance(post, dict), f"Cada post deve ser um objeto JSON{contexto}."
    assert campos_obrigatorios.issubset(post.keys()), (
        f"Post inválido{contexto}: campos obrigatórios ausentes."
    )

    assert isinstance(post["userId"], int), f"userId deve ser int{contexto}."
    assert isinstance(post["id"], int), f"id deve ser int{contexto}."
    assert isinstance(post["title"], str), f"title deve ser string{contexto}."
    assert isinstance(post["body"], str), f"body deve ser string{contexto}."


@pytest.mark.smoke
def test_deve_retornar_posts_com_status_200_lista_100_e_esquema_valido(sessao_api):
    """Valida GET /posts: status, quantidade e esquema/tipos de cada item."""
    resposta = sessao_api.get(ENDPOINT_POSTS, timeout=TIMEOUT)

    # Regra principal do endpoint de listagem.
    assert resposta.status_code == 200, "GET /posts deve retornar 200."

    dados = resposta.json()
    assert isinstance(dados, list), "GET /posts deve retornar uma lista."
    assert len(dados) == 100, "GET /posts deve retornar exatamente 100 registros."

    # Validação de esquema/tipos item a item.
    for indice, post in enumerate(dados, start=1):
        validar_esquema_post(post, posicao=indice)


@pytest.mark.smoke
def test_deve_buscar_post_id_1_com_status_200_e_tipos_validos(sessao_api):
    """Valida GET /posts/1: status 200, id correto e tipos esperados."""
    resposta = sessao_api.get(f"{ENDPOINT_POSTS}/1", timeout=TIMEOUT)

    assert resposta.status_code == 200, "GET /posts/1 deve retornar 200."

    post = resposta.json()
    validar_esquema_post(post)
    assert post["id"] == 1, "GET /posts/1 deve retornar o post com id igual a 1."


@pytest.mark.smoke
def test_deve_criar_post_com_status_201_no_post_posts(sessao_api):
    """
    Valida POST /posts com massa aleatória, criação e ID único.

    Como o endpoint é simulado, a validação de unicidade considera o conjunto
    atual de IDs retornados por GET /posts.
    """
    resposta_lista = sessao_api.get(ENDPOINT_POSTS, timeout=TIMEOUT)
    assert resposta_lista.status_code == 200, "Pré-condição do POST: GET /posts deve retornar 200."

    ids_existentes = {
        post["id"] for post in resposta_lista.json() if isinstance(post, dict) and "id" in post
    }

    sufixo_aleatorio = uuid4().hex
    payload = {
        "title": f"titulo-{sufixo_aleatorio}",
        "body": f"corpo-{sufixo_aleatorio}",
        "userId": randint(1, 10),
    }

    resposta = sessao_api.post(ENDPOINT_POSTS, json=payload, timeout=TIMEOUT)

    assert resposta.status_code == 201, "POST /posts deve retornar 201."

    post_criado = resposta.json()

    # A API simulada (mock) deve retornar um id para o recurso "criado".
    assert "id" in post_criado, "Resposta do POST deve conter o campo id."
    assert isinstance(post_criado["id"], int), "Campo id retornado deve ser int."
    assert post_criado["id"] not in ids_existentes, (
        "O id retornado no POST deve ser único em relação aos IDs atuais de /posts."
    )

    # Garante consistência dos dados enviados x retornados.
    assert post_criado["title"] == payload["title"], "title retornado deve corresponder ao enviado."
    assert post_criado["body"] == payload["body"], "body retornado deve corresponder ao enviado."
    assert post_criado["userId"] == payload["userId"], "userId retornado deve corresponder ao enviado."


@pytest.mark.smoke
def test_deve_deletar_post_1_com_status_200_ou_204(sessao_api):
    """Valida DELETE /posts/1: endpoint deve aceitar retorno 200 ou 204."""
    resposta = sessao_api.delete(f"{ENDPOINT_POSTS}/1", timeout=TIMEOUT)

    # Algumas APIs retornam 200 com corpo; outras 204 sem corpo.
    assert resposta.status_code in (200, 204), "DELETE /posts/1 deve retornar 200 ou 204."


@pytest.mark.contrato
def test_deve_retornar_404_ao_buscar_post_inexistente(sessao_api):
    """
    Cenário negativo: consulta de recurso inexistente.

    No JSONPlaceholder, IDs fora da faixa retornam 404 e objeto vazio.
    """
    resposta = sessao_api.get(f"{ENDPOINT_POSTS}/9999", timeout=TIMEOUT)

    assert resposta.status_code == 404, "GET /posts/9999 deve retornar 404."
    assert resposta.json() == {}, "Para recurso inexistente, o corpo esperado é objeto vazio."


@pytest.mark.contrato
def test_deve_aceitar_payload_invalido_na_api_simulada_com_status_201(sessao_api):
    """
    Cenário negativo (de negócio): payload com tipos incorretos.

    Como o JSONPlaceholder é uma API simulada (mock), ele não valida regras de negócio e
    costuma retornar 201 mesmo para payload inválido.
    """
    payload_invalido = {
        "title": 123,
        "userId": "x",
    }

    resposta = sessao_api.post(ENDPOINT_POSTS, json=payload_invalido, timeout=TIMEOUT)

    # Documenta explicitamente o comportamento real da API de mock.
    assert resposta.status_code == 201, "Nesta API simulada (mock), POST com payload inválido retorna 201."

    post_criado = resposta.json()
    assert "id" in post_criado, "Mesmo com payload inválido, a resposta deve conter id."
    assert post_criado["title"] == payload_invalido["title"], "title deve ser espelhado pela API simulada."
    assert post_criado["userId"] == payload_invalido["userId"], "userId deve ser espelhado pela API simulada."


@pytest.mark.contrato
def test_deve_retornar_content_type_json_no_get_posts(sessao_api):
    """
    Valida contrato HTTP básico do endpoint de listagem.

    A resposta deve informar `application/json` no cabeçalho Content-Type.
    """
    resposta = sessao_api.get(ENDPOINT_POSTS, timeout=TIMEOUT)

    assert resposta.status_code == 200, "GET /posts deve retornar 200."
    content_type = resposta.headers.get("Content-Type", "")
    assert "application/json" in content_type.lower(), (
        "Content-Type de GET /posts deve conter application/json."
    )


@pytest.mark.contrato
def test_deve_filtrar_posts_por_user_id(sessao_api):
    """
    Valida query string de filtro por usuário.

    Em JSONPlaceholder, `GET /posts?userId=1` retorna 10 registros,
    todos com `userId` igual a 1.
    """
    resposta = sessao_api.get(ENDPOINT_POSTS, params={"userId": 1}, timeout=TIMEOUT)

    assert resposta.status_code == 200, "GET /posts?userId=1 deve retornar 200."

    dados = resposta.json()
    assert isinstance(dados, list), "GET /posts?userId=1 deve retornar uma lista."
    assert len(dados) == 10, "GET /posts?userId=1 deve retornar 10 registros."
    assert all(post.get("userId") == 1 for post in dados), (
        "Todos os registros filtrados devem possuir userId igual a 1."
    )


@pytest.mark.contrato
def test_deve_retornar_404_para_ids_de_borda_inexistentes(sessao_api):
    """
    Valida cenários de borda para IDs inexistentes no recurso /posts/{id}.

    IDs 0 e -1 devem retornar 404 e corpo vazio no JSONPlaceholder.
    """
    for identificador in (0, -1):
        resposta = sessao_api.get(f"{ENDPOINT_POSTS}/{identificador}", timeout=TIMEOUT)
        assert resposta.status_code == 404, f"GET /posts/{identificador} deve retornar 404."
        assert resposta.json() == {}, f"GET /posts/{identificador} deve retornar objeto vazio."


@pytest.mark.contrato
def test_deve_retornar_404_para_id_nao_numerico(sessao_api):
    """Valida que ID não numérico também é tratado como recurso inexistente."""
    resposta = sessao_api.get(f"{ENDPOINT_POSTS}/abc", timeout=TIMEOUT)

    assert resposta.status_code == 404, "GET /posts/abc deve retornar 404."
    assert resposta.json() == {}, "GET /posts/abc deve retornar objeto vazio."


@pytest.mark.contrato
def test_deve_responder_em_tempo_aceitavel_no_get_posts(sessao_api):
    """
    Valida desempenho básico do endpoint de listagem.

    O limite é conservador para reduzir flakiness em ambientes de internet variável.
    """
    resposta = sessao_api.get(ENDPOINT_POSTS, timeout=TIMEOUT)

    assert resposta.status_code == 200, "GET /posts deve retornar 200."
    tempo_resposta_ms = resposta.elapsed.total_seconds() * 1000
    assert tempo_resposta_ms < TEMPO_MAXIMO_MS, (
        f"Tempo de resposta ({tempo_resposta_ms:.2f} ms) deve ser menor que {TEMPO_MAXIMO_MS} ms."
    )
