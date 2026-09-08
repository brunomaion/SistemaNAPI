package br.unioeste.napirotas.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import br.unioeste.napirotas.dto.ClusterizacaoRequestDTO;
import br.unioeste.napirotas.dto.ClusterizacaoResponseDTO;
import br.unioeste.napirotas.dto.PontoClusterDTO;
import br.unioeste.napirotas.model.Grupo;
import br.unioeste.napirotas.model.Pontos;
import br.unioeste.napirotas.model.Regiao;
import br.unioeste.napirotas.repository.GrupoRepository;
import br.unioeste.napirotas.repository.PontosRepository;
import br.unioeste.napirotas.repository.RegiaoRepository;

@Service
public class OtimizacaoService {

    private final GrupoRepository grupoRepository;
    private final PontosRepository pontosRepository;
    private final RegiaoRepository regiaoRepository;
    private final RestTemplate restTemplate;

    @Value("${clustering.service.url}")
    private String clusteringServiceUrl;

    public OtimizacaoService(
            GrupoRepository grupoRepository,
            PontosRepository pontosRepository,
            RegiaoRepository regiaoRepository,
            RestTemplate restTemplate) {
        this.grupoRepository = grupoRepository;
        this.pontosRepository = pontosRepository;
        this.regiaoRepository = regiaoRepository;
        this.restTemplate = restTemplate;
    }

    public List<Grupo> clusterizar(Long regiaoId, int numGrupos) {
        Regiao regiao = regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new RuntimeException("Região não encontrada"));

        List<Pontos> todosPontos = pontosRepository.findByGrupoRegiaoId(regiaoId);

        List<Pontos> pontosComCoordenadas = todosPontos.stream()
                .filter(p -> p.getLatitude() != null && p.getLongitude() != null)
                .toList();

        List<Pontos> pontosSemCoordenadas = todosPontos.stream()
                .filter(p -> p.getLatitude() == null || p.getLongitude() == null)
                .toList();

        if (pontosComCoordenadas.isEmpty()) {
            throw new RuntimeException(
                    "A região não possui pontos com coordenadas para clusterizar");
        }

        if (numGrupos < 1 || numGrupos > pontosComCoordenadas.size()) {
            throw new RuntimeException(
                    "Número de grupos inválido para a quantidade de pontos disponíveis");
        }

        List<Long> gruposAntigosIds = grupoRepository.findByRegiaoId(regiaoId).stream()
                .map(Grupo::getId)
                .toList();

        ClusterizacaoRequestDTO requisicao = new ClusterizacaoRequestDTO(
                pontosComCoordenadas.stream()
                        .map(p -> new PontoClusterDTO(p.getId(), p.getLatitude(), p.getLongitude()))
                        .toList(),
                numGrupos
        );

        ClusterizacaoResponseDTO resposta = restTemplate.postForObject(
                clusteringServiceUrl + "/clusterizar",
                requisicao,
                ClusterizacaoResponseDTO.class
        );

        if (resposta == null || resposta.clusters() == null || resposta.clusters().isEmpty()) {
            throw new RuntimeException("Serviço de clusterização não retornou resultado");
        }

        Map<Long, Pontos> pontosPorId = pontosComCoordenadas.stream()
                .collect(Collectors.toMap(Pontos::getId, p -> p));

        List<Grupo> novosGrupos = new ArrayList<>();
        for (int i = 0; i < resposta.clusters().size(); i++) {
            Grupo novoGrupo = new Grupo();
            novoGrupo.setNumero(i + 1);
            novoGrupo.setRegiao(regiao);
            novosGrupos.add(grupoRepository.save(novoGrupo));
        }

        for (int i = 0; i < resposta.clusters().size(); i++) {
            Grupo destino = novosGrupos.get(i);

            for (Long pontoId : resposta.clusters().get(i)) {
                Pontos ponto = pontosPorId.get(pontoId);

                if (ponto != null) {
                    ponto.setGrupo(destino);
                    pontosRepository.save(ponto);
                }
            }
        }

        for (Pontos ponto : pontosSemCoordenadas) {
            ponto.setGrupo(novosGrupos.get(0));
            pontosRepository.save(ponto);
        }

        grupoRepository.deleteAllById(gruposAntigosIds);

        return grupoRepository.findByRegiaoId(regiaoId);
    }
}
