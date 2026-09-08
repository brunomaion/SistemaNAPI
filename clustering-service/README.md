# Serviço de Clusterização

Microsserviço Python (FastAPI + scikit-learn) que agrupa pontos de coleta por
proximidade geográfica (KMeans). É chamado pelo backend Java
(`OtimizacaoService`) — o frontend nunca fala diretamente com ele.

## Rodando localmente

```bash
cd clustering-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 5000
```

## Endpoint

`POST /clusterizar`

Entrada:

```json
{
  "pontos": [
    { "id": 1, "latitude": -24.55, "longitude": -54.02 },
    { "id": 2, "latitude": -24.56, "longitude": -54.03 }
  ],
  "numGrupos": 2
}
```

Saída (lista de clusters, cada um com os ids dos pontos que pertencem a ele):

```json
{
  "clusters": [
    [1],
    [2]
  ]
}
```

O backend Java usa essa resposta para criar/realocar os `Grupo`s da região.
A URL desse serviço é configurada em
`backend/src/main/resources/application.properties`
(`clustering.service.url`).
