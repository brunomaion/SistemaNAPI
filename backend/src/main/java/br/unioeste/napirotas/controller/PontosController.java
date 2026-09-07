package br.unioeste.napirotas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.unioeste.napirotas.model.Pontos;
import br.unioeste.napirotas.service.PontosService;

@RestController
@RequestMapping("/regioes/{regiaoId}/grupos/{grupoId}/pontos")
@CrossOrigin(origins = "http://localhost:5173")
public class PontosController {

    private final PontosService pontosService;

    public PontosController(PontosService pontosService) {
        this.pontosService = pontosService;
    }

    @GetMapping
    public ResponseEntity<List<Pontos>> listar(
            @PathVariable Long regiaoId,
            @PathVariable Long grupoId) {

        return ResponseEntity.ok(
                pontosService.listarPorGrupo(
                        regiaoId,
                        grupoId));
    }

    @GetMapping("/{pontoId}")
    public ResponseEntity<Pontos> buscarPorId(
            @PathVariable Long regiaoId,
            @PathVariable Long grupoId,
            @PathVariable Long pontoId) {

        return ResponseEntity.ok(
                pontosService.buscarPorId(
                        regiaoId,
                        grupoId,
                        pontoId));
    }

    @PostMapping
    public ResponseEntity<List<Pontos>> salvar(
            @PathVariable Long regiaoId,
            @PathVariable Long grupoId,
            @RequestBody List<Pontos> pontos) {

        return ResponseEntity.ok(
                pontosService.salvar(
                        regiaoId,
                        grupoId,
                        pontos));
    }

    @PutMapping("/{pontoId}")
    public ResponseEntity<Pontos> atualizar(
            @PathVariable Long regiaoId,
            @PathVariable Long grupoId,
            @PathVariable Long pontoId,
            @RequestBody Pontos dados) {

        return ResponseEntity.ok(
                pontosService.atualizar(
                        regiaoId,
                        grupoId,
                        pontoId,
                        dados));
    }

    @PutMapping("/{pontoId}/grupo/{novoGrupoId}")
    public ResponseEntity<Pontos> moverGrupo(
            @PathVariable Long regiaoId,
            @PathVariable Long grupoId,
            @PathVariable Long pontoId,
            @PathVariable Long novoGrupoId) {

        return ResponseEntity.ok(
                pontosService.moverGrupo(
                        regiaoId,
                        grupoId,
                        pontoId,
                        novoGrupoId));
    }

    @DeleteMapping("/{pontoId}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long regiaoId,
            @PathVariable Long grupoId,
            @PathVariable Long pontoId) {

        pontosService.deletar(
                regiaoId,
                grupoId,
                pontoId);

        return ResponseEntity.noContent().build();
    }
}