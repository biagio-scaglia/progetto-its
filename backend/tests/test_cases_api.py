"""Test CRUD completo per l'API /cases con naming italiano."""
import uuid


def _codice():
    """Genera un codice univoco per i test."""
    return f"TEST-{uuid.uuid4().hex[:8].upper()}"


class TestCaseCRUD:
    """Verifica creazione, lettura, aggiornamento ed eliminazione di un caso."""

    def test_create_case(self, client):
        codice = _codice()
        response = client.post(
            "/api/v1/cases/",
            json={"titolo": "Rinnovo permesso", "descrizione": "Pratica di rinnovo", "stato": "aperto", "codice": codice},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["titolo"] == "Rinnovo permesso"
        assert data["stato"] == "aperto"
        assert "id" in data

    def test_list_cases_empty(self, client):
        response = client.get("/api/v1/cases/")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_case_not_found(self, client):
        response = client.get("/api/v1/cases/999")
        assert response.status_code == 404

    def test_get_case_with_relations(self, client):
        codice = _codice()
        create = client.post(
            "/api/v1/cases/",
            json={"titolo": "Caso test", "stato": "aperto", "codice": codice},
        )
        case_id = create.json()["id"]

        response = client.get(f"/api/v1/cases/{case_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["documents"] == []
        assert data["deadlines"] == []
        assert data["notes"] == []

    def test_update_case(self, client):
        codice = _codice()
        create = client.post(
            "/api/v1/cases/",
            json={"titolo": "Originale", "stato": "aperto", "codice": codice},
        )
        case_id = create.json()["id"]

        response = client.put(
            f"/api/v1/cases/{case_id}",
            json={"titolo": "Aggiornato", "stato": "in_lavorazione"},
        )
        assert response.status_code == 200
        assert response.json()["titolo"] == "Aggiornato"
        assert response.json()["stato"] == "in_lavorazione"

    def test_delete_case(self, client):
        codice = _codice()
        create = client.post(
            "/api/v1/cases/",
            json={"titolo": "Da eliminare", "stato": "aperto", "codice": codice},
        )
        case_id = create.json()["id"]

        response = client.delete(f"/api/v1/cases/{case_id}")
        assert response.status_code == 204

        get_resp = client.get(f"/api/v1/cases/{case_id}")
        assert get_resp.status_code == 404

    def test_search_cases(self, client):
        client.post("/api/v1/cases/", json={"titolo": "Rinnovo permesso", "stato": "aperto", "codice": _codice()})
        client.post("/api/v1/cases/", json={"titolo": "Richiesta asilo", "stato": "aperto", "codice": _codice()})

        response = client.get("/api/v1/cases/", params={"q": "permesso"})
        assert response.status_code == 200
        assert len(response.json()) == 1

    def test_filter_by_stato(self, client):
        client.post("/api/v1/cases/", json={"titolo": "Caso 1", "stato": "aperto", "codice": _codice()})
        client.post("/api/v1/cases/", json={"titolo": "Caso 2", "stato": "chiuso", "codice": _codice()})

        response = client.get("/api/v1/cases/", params={"stato": "chiuso"})
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["stato"] == "chiuso"


class TestDocumentCRUD:
    """Verifica CRUD per documenti come sotto-risorsa di un caso."""

    def _create_case(self, client) -> int:
        resp = client.post("/api/v1/cases/", json={"titolo": "Caso doc", "stato": "aperto", "codice": _codice()})
        return resp.json()["id"]

    def test_create_document(self, client):
        case_id = self._create_case(client)
        response = client.post(
            f"/api/v1/cases/{case_id}/documents",
            json={"nome": "Passaporto", "tipo": "PDF", "dimensione": "1.5 MB", "stato": "da_caricare"},
        )
        assert response.status_code == 201
        assert response.json()["nome"] == "Passaporto"

    def test_list_documents(self, client):
        case_id = self._create_case(client)
        client.post(
            f"/api/v1/cases/{case_id}/documents",
            json={"nome": "Doc 1", "tipo": "PDF", "dimensione": "2 MB", "stato": "da_caricare"},
        )
        response = client.get(f"/api/v1/cases/{case_id}/documents")
        assert response.status_code == 200
        assert len(response.json()) == 1

    def test_delete_document(self, client):
        case_id = self._create_case(client)
        doc = client.post(
            f"/api/v1/cases/{case_id}/documents",
            json={"nome": "Doc temp", "tipo": "PNG", "dimensione": "500 KB", "stato": "da_caricare"},
        )
        doc_id = doc.json()["id"]

        response = client.delete(f"/api/v1/cases/documents/{doc_id}")
        assert response.status_code == 204


class TestDeadlineCRUD:
    """Verifica CRUD per scadenze come sotto-risorsa di un caso."""

    def _create_case(self, client) -> int:
        resp = client.post("/api/v1/cases/", json={"titolo": "Caso deadline", "stato": "aperto", "codice": _codice()})
        return resp.json()["id"]

    def test_create_deadline(self, client):
        case_id = self._create_case(client)
        response = client.post(
            f"/api/v1/cases/{case_id}/deadlines",
            json={"titolo": "Scadenza documenti", "data_scadenza": "2026-07-15"},
        )
        assert response.status_code == 201
        assert response.json()["titolo"] == "Scadenza documenti"

    def test_list_deadlines(self, client):
        case_id = self._create_case(client)
        client.post(
            f"/api/v1/cases/{case_id}/deadlines",
            json={"titolo": "Scadenza 1", "data_scadenza": "2026-08-01"},
        )
        response = client.get(f"/api/v1/cases/{case_id}/deadlines")
        assert response.status_code == 200
        assert len(response.json()) == 1


class TestNoteCRUD:
    """Verifica CRUD per note come sotto-risorsa di un caso."""

    def _create_case(self, client) -> int:
        resp = client.post("/api/v1/cases/", json={"titolo": "Caso note", "stato": "aperto", "codice": _codice()})
        return resp.json()["id"]

    def test_create_note(self, client):
        case_id = self._create_case(client)
        response = client.post(
            f"/api/v1/cases/{case_id}/notes",
            json={"contenuto": "Prima nota di prova"},
        )
        assert response.status_code == 201
        assert response.json()["contenuto"] == "Prima nota di prova"

    def test_list_notes(self, client):
        case_id = self._create_case(client)
        client.post(f"/api/v1/cases/{case_id}/notes", json={"contenuto": "Nota 1"})
        client.post(f"/api/v1/cases/{case_id}/notes", json={"contenuto": "Nota 2"})

        response = client.get(f"/api/v1/cases/{case_id}/notes")
        assert response.status_code == 200
        assert len(response.json()) == 2


class TestHealthCheck:
    """Verifica l'endpoint di health check."""

    def test_health(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
