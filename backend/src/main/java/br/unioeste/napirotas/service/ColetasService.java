package br.unioeste.napirotas.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import br.unioeste.napirotas.model.Coletas;
import br.unioeste.napirotas.model.Coletas.Grupo;
import br.unioeste.napirotas.model.Coletas.Ponto;
import br.unioeste.napirotas.repository.ColetasRepository;

@Service
public class ColetasService {

    private final ColetasRepository repository;

    public ColetasService(ColetasRepository repository) {
        this.repository = repository;
    }

    public List<Coletas> listar() {
        return repository.findAll();
    }

    public Coletas buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coleta não encontrada"));
    }

    public Coletas criar(Coletas coleta) {
        coleta.setId(null);
        normalizarGrupos(coleta);
        return repository.save(coleta);
    }

    public Coletas atualizar(Long id, Coletas dados) {
        Coletas coleta = buscarPorId(id);
        coleta.setNomeColeta(dados.getNomeColeta());
        coleta.setDataInicio(dados.getDataInicio());
        coleta.setDataFim(dados.getDataFim());
        coleta.setPontos(dados.getPontos() == null ? new ArrayList<>() : dados.getPontos());
        coleta.setGrupos(dados.getGrupos() == null ? new ArrayList<>() : dados.getGrupos());
        normalizarGrupos(coleta);
        return repository.save(coleta);
    }

    public Grupo adicionarGrupo(Long coletaId) {
        Coletas coleta = buscarPorId(coletaId);
        normalizarGrupos(coleta);
        Grupo grupo = new Grupo();
        grupo.setId(proximoGrupoId(coleta.getGrupos()));
        coleta.getGrupos().add(grupo);
        repository.save(coleta);
        return grupo;
    }

    public Coletas adicionarPonto(Long coletaId, Long grupoId, Ponto ponto) {
        Coletas coleta = buscarPorId(coletaId);
        normalizarGrupos(coleta);
        Grupo grupo = encontrarGrupo(coleta, grupoId);
        if (coleta.getPontos() == null) {
            coleta.setPontos(new ArrayList<>());
        }
        ponto.setId(proximoId(coleta.getPontos()));
        grupo.getPontos().add(coleta.getPontos().size());
        coleta.getPontos().add(ponto);
        return repository.save(coleta);
    }

    private void normalizarGrupos(Coletas coleta) {
        if (coleta.getPontos() == null) {
            coleta.setPontos(new ArrayList<>());
        }
        long pontoId = 1;
        for (Ponto ponto : coleta.getPontos()) {
            if (ponto.getId() == null) {
                ponto.setId(pontoId);
            }
            pontoId = Math.max(pontoId, ponto.getId() + 1);
        }
        if (coleta.getGrupos() == null) {
            coleta.setGrupos(new ArrayList<>());
        }
        if (coleta.getGrupos().isEmpty()) {
            Grupo grupo = new Grupo();
            grupo.setId(1L);
            coleta.getGrupos().add(grupo);
        }
        long grupoId = 1;
        for (Grupo grupo : coleta.getGrupos()) {
            if (grupo.getId() == null) {
                grupo.setId(grupoId);
            }
            grupoId = Math.max(grupoId, grupo.getId() + 1);
            if (grupo.getPontos() == null) {
                grupo.setPontos(new ArrayList<>());
            }
            grupo.getPontos().removeIf(indice -> indice == null
                    || indice < 0
                    || indice >= coleta.getPontos().size());
        }
    }

    private Grupo encontrarGrupo(Coletas coleta, Long grupoId) {
        return coleta.getGrupos().stream()
                .filter(grupo -> grupo.getId().equals(grupoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado"));
    }

    private Long proximoId(List<Ponto> pontos) {
        long maiorId = pontos.stream()
                .map(Ponto::getId)
                .filter(id -> id != null)
                .mapToLong(Long::longValue)
                .max()
                .orElse(0L);
        return maiorId + 1;
    }

    private Long proximoGrupoId(List<Grupo> grupos) {
        long maiorId = grupos.stream()
                .map(Grupo::getId)
                .filter(id -> id != null)
                .mapToLong(Long::longValue)
                .max()
                .orElse(0L);
        return maiorId + 1;
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}