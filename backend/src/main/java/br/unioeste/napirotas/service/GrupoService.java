package br.unioeste.napirotas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.unioeste.napirotas.model.Grupo;
import br.unioeste.napirotas.model.Regiao;
import br.unioeste.napirotas.repository.GrupoRepository;
import br.unioeste.napirotas.repository.RegiaoRepository;

@Service
public class GrupoService {

    private final GrupoRepository grupoRepository;
    private final RegiaoRepository regiaoRepository;

    public GrupoService(
            GrupoRepository grupoRepository,
            RegiaoRepository regiaoRepository) {
        this.grupoRepository = grupoRepository;
        this.regiaoRepository = regiaoRepository;
    }

    public List<Grupo> listarPorRegiao(Long regiaoId) {
        verificarRegiao(regiaoId);
        return grupoRepository.findByRegiaoId(regiaoId);
    }

    public Grupo buscarPorId(Long regiaoId, Long grupoId) {
        Grupo grupo = buscar(grupoId);

        if (!grupo.getRegiao().getId().equals(regiaoId)) {
            throw new RuntimeException(
                    "O grupo não pertence à região informada");
        }

        return grupo;
    }

    public Grupo criar(Long regiaoId) {
        Regiao regiao = verificarRegiao(regiaoId);

        List<Grupo> grupos = grupoRepository.findByRegiaoId(regiaoId);

        int numero = grupos.stream()
                .map(Grupo::getNumero)
                .filter(n -> n != null)
                .max(Integer::compareTo)
                .orElse(0) + 1;

        Grupo grupo = new Grupo();
        grupo.setNumero(numero);
        grupo.setRegiao(regiao);

        return grupoRepository.save(grupo);
    }

    public void deletar(Long regiaoId, Long grupoId) {
        Grupo grupo = buscarPorId(regiaoId, grupoId);
        grupoRepository.delete(grupo);
    }

    private Grupo buscar(Long id) {
        return grupoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Grupo não encontrado"));
    }

    private Regiao verificarRegiao(Long regiaoId) {
        return regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new RuntimeException(
                        "Região não encontrada"));
    }
}