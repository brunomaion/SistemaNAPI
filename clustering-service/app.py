"""
Serviço de clusterização de pontos de coleta.

Recebe uma lista de pontos (id, latitude, longitude) e um número de grupos
desejado, e devolve os pontos agrupados por proximidade geográfica usando
KMeans.

Executar:
    pip install -r requirements.txt
    uvicorn app:app --host 0.0.0.0 --port 5000
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.cluster import KMeans
import numpy as np

app = FastAPI(title="Serviço de Clusterização NAPI")


class Ponto(BaseModel):
    id: int
    latitude: float
    longitude: float


class ClusterizacaoRequest(BaseModel):
    pontos: list[Ponto]
    numGrupos: int


class ClusterizacaoResponse(BaseModel):
    clusters: list[list[int]]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/clusterizar", response_model=ClusterizacaoResponse)
def clusterizar(request: ClusterizacaoRequest):
    pontos = request.pontos
    num_grupos = request.numGrupos

    if not pontos:
        raise HTTPException(400, "Nenhum ponto informado")

    if num_grupos < 1 or num_grupos > len(pontos):
        raise HTTPException(
            400,
            f"numGrupos deve estar entre 1 e {len(pontos)} (quantidade de pontos)",
        )

    coordenadas = np.array([[p.latitude, p.longitude] for p in pontos])

    kmeans = KMeans(n_clusters=num_grupos, n_init=10, random_state=42)
    labels = kmeans.fit_predict(coordenadas)

    clusters: list[list[int]] = [[] for _ in range(num_grupos)]
    for ponto, label in zip(pontos, labels):
        clusters[label].append(ponto.id)

    return ClusterizacaoResponse(clusters=clusters)
