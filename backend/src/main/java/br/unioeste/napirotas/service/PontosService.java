package br.unioeste.napirotas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.unioeste.napirotas.model.Grupo;
import br.unioeste.napirotas.model.Pontos;
import br.unioeste.napirotas.repository.GrupoRepository;
import br.unioeste.napirotas.repository.PontosRepository;

@Service
public class PontosService {

    private final PontosRepository pontosRepository;
    private final GrupoRepository grupoRepository;

    public PontosService(
            PontosRepository pontosRepository,
            GrupoRepository grupoRepository) {
        this.pontosRepository = pontosRepository;
        this.grupoRepository = grupoRepository;
    }

    public List<Pontos> listarPorGrupo(
            Long regiaoId,
            Long grupoId) {

        Grupo grupo = buscarGrupo(regiaoId, grupoId);

        return pontosRepository.findByGrupoId(grupo.getId());
    }

    public Pontos buscarPorId(
            Long regiaoId,
            Long grupoId,
            Long pontoId) {

        Grupo grupo = buscarGrupo(regiaoId, grupoId);

        Pontos ponto = pontosRepository.findById(pontoId)
                .orElseThrow(() -> new RuntimeException(
                        "Ponto não encontrado"));

        if (!ponto.getGrupo().getId().equals(grupo.getId())) {
            throw new RuntimeException(
                    "O ponto não pertence ao grupo informado");
        }

        return ponto;
    }

    public List<Pontos> salvar(
            Long regiaoId,
            Long grupoId,
            List<Pontos> pontos) {

        Grupo grupo = buscarGrupo(regiaoId, grupoId);

        for (Pontos ponto : pontos) {
            ponto.setGrupo(grupo);
        }

        return pontosRepository.saveAll(pontos);
    }

    public Pontos atualizar(
            Long regiaoId,
            Long grupoId,
            Long pontoId,
            Pontos dados) {

        Pontos ponto = buscarPorId(
                regiaoId,
                grupoId,
                pontoId);

        ponto.setNomePonto(dados.getNomePonto());
        ponto.setLatitude(dados.getLatitude());
        ponto.setLongitude(dados.getLongitude());

        return pontosRepository.save(ponto);
    }

    public Pontos moverGrupo(
            Long regiaoId,
            Long grupoId,
            Long pontoId,
            Long novoGrupoId) {

        Pontos ponto = buscarPorId(
                regiaoId,
                grupoId,
                pontoId);

        Grupo novoGrupo = buscarGrupo(
                regiaoId,
                novoGrupoId);

        ponto.setGrupo(novoGrupo);

        return pontosRepository.save(ponto);
    }

    public void deletar(
            Long regiaoId,
            Long grupoId,
            Long pontoId) {

        Pontos ponto = buscarPorId(
                regiaoId,
                grupoId,
                pontoId);

        pontosRepository.delete(ponto);
    }

    private Grupo buscarGrupo(
            Long regiaoId,
            Long grupoId) {

        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new RuntimeException(
                        "Grupo não encontrado"));

        if (!grupo.getRegiao().getId().equals(regiaoId)) {
            throw new RuntimeException(
                    "O grupo não pertence à região informada");
        }

        return grupo;
    }
}