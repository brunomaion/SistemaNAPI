package br.unioeste.napirotas.dto;

import java.util.List;

public record ClusterizacaoResponseDTO(
        List<List<Long>> clusters
) {
}
