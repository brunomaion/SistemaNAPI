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

import br.unioeste.napirotas.model.Pontos;
import br.unioeste.napirotas.service.PontosService;

@RestController
@RequestMapping("/regioes")
@CrossOrigin(origins = "http://localhost:5173")
public class PontosController {

    private final PontosService pontosService;

    public PontosController(PontosService pontosService) {
        this.pontosService = pontosService;
    }

    @GetMapping("/{regiaoId}/pontos")
    public ResponseEntity<List<Pontos>> listarPorRegiao(
            @PathVariable Long regiaoId) {

        return ResponseEntity.ok(
                pontosService.listarPorRegiao(regiaoId)
        );
    }

    @PostMapping("/{regiaoId}/pontos")
    public ResponseEntity<Pontos> salvar(
            @PathVariable Long regiaoId,
            @RequestBody Pontos ponto) {

        return ResponseEntity.ok(
                pontosService.salvar(ponto, regiaoId)
        );
    }

    @PutMapping("/{regiaoId}/pontos/{pontoId}")
    public ResponseEntity<Pontos> atualizar(
            @PathVariable Long regiaoId,
            @PathVariable Long pontoId,
            @RequestBody Pontos ponto) {

        return ResponseEntity.ok(
                pontosService.atualizar(pontoId, ponto, regiaoId)
        );
    }

    @DeleteMapping("/{regiaoId}/pontos/{pontoId}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long regiaoId,
            @PathVariable Long pontoId) {

        pontosService.deletar(pontoId);

        return ResponseEntity.noContent().build();
    }
}