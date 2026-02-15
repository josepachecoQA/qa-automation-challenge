from datetime import datetime


def pytest_html_report_title(report):
    report.title = "Relatório de Testes de API | JSONPlaceholder"


def pytest_configure(config):
    metadata = getattr(config, "_metadata", None)
    if metadata is None:
        return

    metadata["Projeto"] = "API Tests - JSONPlaceholder"
    metadata["Tipo de Teste"] = "Teste de API"
    metadata["Suíte"] = "Posts"
    metadata["Execução"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
