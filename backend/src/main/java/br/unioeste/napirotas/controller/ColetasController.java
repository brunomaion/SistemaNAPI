package br.unioeste.napirotas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unioeste.napirotas.model.Coletas;
import br.unioeste.napirotas.model.Coletas.Grupo;
import br.unioeste.napirotas.model.Coletas.Ponto;
import br.unioeste.napirotas.service.ColetasService;

@RestController
@RequestMapping("/coletas")
@CrossOrigin(origins = "http://localhost:5173")
public class ColetasController {

    private final ColetasService service;

    public ColetasController(ColetasService service) {
        this.service = service;
    }

    @GetMapping
    public List<Coletas> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coletas> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Coletas> criar(@RequestBody Coletas coleta) {
        return ResponseEntity.ok(service.criar(coleta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coletas> atualizar(
            @PathVariable Long id,
            @RequestBody Coletas coleta) {
        return ResponseEntity.ok(service.atualizar(id, coleta));
    }

    @PostMapping("/{id}/grupos")
    public ResponseEntity<Grupo> adicionarGrupo(@PathVariable Long id) {
        return ResponseEntity.ok(service.adicionarGrupo(id));
    }

    @PostMapping("/{coletaId}/grupos/{grupoId}/pontos")
    public ResponseEntity<Coletas> adicionarPonto(
            @PathVariable Long coletaId,
            @PathVariable Long grupoId,
            @RequestBody Ponto ponto) {
        return ResponseEntity.ok(service.adicionarPonto(coletaId, grupoId, ponto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}