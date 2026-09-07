# Consultas

## Relacionamentos

Regiao 1 ─────── N Grupo

Grupo 1 ─────── N Pontos

## Estrutura

Regiao

└── Grupo 1
  ├── Ponto 1
  ├── Ponto 2
  └── Ponto 3

└── Grupo 2
  ├── Ponto 4
  └── Ponto 5

## Regiao

* id
* nomeRegiao
* dataInicio
* dataFim

## Grupo

* id
* numero
* regiao_id

## Pontos

* id
* nomePonto
* latitude
* longitude
* grupo_id

## RegiaoController

`GET /regioes` — Lista todas as regiões cadastradas.
`GET /regioes/{regiaoId}` — Busca uma região específica pelo ID.
`POST /regioes` — Cria uma nova região. Ao criar a região, o Grupo 1 é criado automaticamente.
`PUT /regioes/{regiaoId}` — Atualiza os dados de uma região.
`DELETE /regioes/{regiaoId}` — Exclui uma região.

## GrupoController

`GET /regioes/{regiaoId}/grupos` — Lista todos os grupos pertencentes a uma região.
`GET /regioes/{regiaoId}/grupos/{grupoId}` — Busca um grupo específico dentro de uma região.
`POST /regioes/{regiaoId}/grupos` — Cria um novo grupo dentro de uma região.
`DELETE /regioes/{regiaoId}/grupos/{grupoId}` — Exclui um grupo de uma região.


## PontosController

`GET /regioes/{regiaoId}/grupos/{grupoId}/pontos` — Lista todos os pontos pertencentes a um grupo de uma região.
`GET /regioes/{regiaoId}/grupos/{grupoId}/pontos/{pontoId}` — Busca um ponto específico dentro de um grupo de uma região.
`POST /regioes/{regiaoId}/grupos/{grupoId}/pontos` — Cria um ou vários pontos dentro de um grupo de uma região.
`PUT /regioes/{regiaoId}/grupos/{grupoId}/pontos/{pontoId}` — Atualiza os dados de um ponto.
`PUT /regioes/{regiaoId}/grupos/{grupoId}/pontos/{pontoId}/grupo/{novoGrupoId}` — Move um ponto para outro grupo da mesma região.
`DELETE /regioes/{regiaoId}/grupos/{grupoId}/pontos/{pontoId}` — Exclui um ponto específico.
