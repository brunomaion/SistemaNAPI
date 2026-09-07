package br.unioeste.napirotas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.unioeste.napirotas.model.Regiao;
import br.unioeste.napirotas.repository.RegiaoRepository;

@Service
public class RegiaoService {

    private final RegiaoRepository regiaoRepository;

    public RegiaoService(RegiaoRepository regiaoRepository) {
        this.regiaoRepository = regiaoRepository;
    }

    public List<Regiao> listarTodos() {
        return regiaoRepository.findAll();
    }

    public Regiao buscarPorId(Long id) {
        return regiaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Região não encontrada"));
    }

    public Regiao salvar(Regiao regiao) {
        return regiaoRepository.save(regiao);
    }

    public Regiao atualizar(Long id, Regiao regiao) {
        Regiao regiaoExistente = buscarPorId(id);

        regiaoExistente.setNomeRegiao(regiao.getNomeRegiao());
        regiaoExistente.setDataInicio(regiao.getDataInicio());
        regiaoExistente.setDataFim(regiao.getDataFim());

        return regiaoRepository.save(regiaoExistente);
    }

    public void deletar(Long id) {
        Regiao regiao = buscarPorId(id);
        regiaoRepository.delete(regiao);
    }
}