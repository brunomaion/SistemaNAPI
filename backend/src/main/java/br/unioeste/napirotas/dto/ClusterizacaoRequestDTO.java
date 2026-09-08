package br.unioeste.napirotas.dto;

import java.util.List;

public record ClusterizacaoRequestDTO(
        List<PontoClusterDTO> pontos,
        Integer numGrupos
) {
}
