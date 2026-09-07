package br.unioeste.napirotas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.unioeste.napirotas.model.Pontos;
import br.unioeste.napirotas.model.Regiao;
import br.unioeste.napirotas.repository.PontosRepository;
import br.unioeste.napirotas.repository.RegiaoRepository;

@Service
public class PontosService {

    private final PontosRepository pontosRepository;
    private final RegiaoRepository regiaoRepository;

    public PontosService(
            PontosRepository pontosRepository,
            RegiaoRepository regiaoRepository) {
        this.pontosRepository = pontosRepository;
        this.regiaoRepository = regiaoRepository;
    }

    public List<Pontos> listarTodos() {
        return pontosRepository.findAll();
    }

    public Pontos buscarPorId(Long id) {
        return pontosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ponto não encontrado"));
    }

    public List<Pontos> listarPorRegiao(Long regiaoId) {
        return pontosRepository.findByRegiaoId(regiaoId);
    }

    public List<Pontos> salvar(
            List<Pontos> pontos,
            Long regiaoId) {

        Regiao regiao = regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new RuntimeException("Região não encontrada"));

        for (Pontos ponto : pontos) {
            ponto.setRegiao(regiao);
        }

        return pontosRepository.saveAll(pontos);
    }

    public Pontos atualizar(Long id, Pontos ponto, Long regiaoId) {

        Pontos pontoExistente = buscarPorId(id);

        Regiao regiao = regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new RuntimeException("Região não encontrada"));

        pontoExistente.setNomePonto(ponto.getNomePonto());
        pontoExistente.setLatitude(ponto.getLatitude());
        pontoExistente.setLongitude(ponto.getLongitude());
        pontoExistente.setRegiao(regiao);

        return pontosRepository.save(pontoExistente);
    }

    public void deletar(Long id) {
        Pontos ponto = buscarPorId(id);
        pontosRepository.delete(ponto);
    }
}