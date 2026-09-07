package br.unioeste.napirotas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.unioeste.napirotas.model.Grupo;
import br.unioeste.napirotas.service.GrupoService;

@RestController
@RequestMapping("/regioes/{regiaoId}/grupos")
@CrossOrigin(origins = "http://localhost:5173")
public class GrupoController {

    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    @GetMapping
    public ResponseEntity<List<Grupo>> listarPorRegiao(
            @PathVariable Long regiaoId) {

        return ResponseEntity.ok(
                grupoService.listarPorRegiao(regiaoId));
    }

    @GetMapping("/{grupoId}")
    public ResponseEntity<Grupo> buscarPorId(
            @PathVariable Long regiaoId,
            @PathVariable Long grupoId) {

        return ResponseEntity.ok(
                grupoService.buscarPorId(regiaoId, grupoId));
    }

    @PostMapping
    public ResponseEntity<Grupo> criar(
            @PathVariable Long regiaoId) {

        return ResponseEntity.ok(
                grupoService.criar(regiaoId));
    }

    @DeleteMapping("/{grupoId}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long regiaoId,
            @PathVariable Long grupoId) {

        grupoService.deletar(regiaoId, grupoId);

        return ResponseEntity.noContent().build();
    }
}