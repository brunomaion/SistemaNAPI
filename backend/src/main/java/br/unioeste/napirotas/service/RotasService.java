package br.unioeste.napirotas.service;

import br.unioeste.napirotas.model.Rotas;
import br.unioeste.napirotas.repository.RotasRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RotasService {

    private final RotasRepository repository;

    public RotasService(RotasRepository repository) {
        this.repository = repository;
    }

    public List<Rotas> listarTodas() {
        return repository.findAll();
    }

    public Optional<Rotas> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Rotas salvar(Rotas rota) {
        return repository.save(rota);
    }

    public Rotas atualizar(Long id, Rotas novaRota) {
        return repository.findById(id).map(rota -> {

            rota.setNomeRota(novaRota.getNomeRota());
            rota.setAutoresResponsaveisID(novaRota.getAutoresResponsaveisID());
            rota.setPontoOrigem(novaRota.getPontoOrigem());
            rota.setPontos(novaRota.getPontos());
            rota.setClusters(novaRota.getClusters());
            rota.setMatrizCustoGlobal(novaRota.getMatrizCustoGlobal());
            rota.setMatrizCustoClusters(novaRota.getMatrizCustoClusters());
            rota.setCustoTotal(novaRota.getCustoTotal());
            rota.setTempoTotal(novaRota.getTempoTotal());

            return repository.save(rota);
        }).orElseThrow(() -> new RuntimeException("Rota não encontrada"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}