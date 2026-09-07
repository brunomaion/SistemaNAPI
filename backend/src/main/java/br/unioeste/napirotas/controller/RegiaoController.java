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

import br.unioeste.napirotas.model.Regiao;
import br.unioeste.napirotas.service.RegiaoService;

@RestController
@RequestMapping("/regioes")
@CrossOrigin(origins = "http://localhost:5173")
public class RegiaoController {

    private final RegiaoService regiaoService;

    public RegiaoController(RegiaoService regiaoService) {
        this.regiaoService = regiaoService;
    }

    @GetMapping
    public ResponseEntity<List<Regiao>> listarTodos() {
        return ResponseEntity.ok(regiaoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Regiao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(regiaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Regiao> salvar(@RequestBody Regiao regiao) {
        return ResponseEntity.ok(regiaoService.salvar(regiao));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Regiao> atualizar(
            @PathVariable Long id,
            @RequestBody Regiao regiao) {

        return ResponseEntity.ok(
                regiaoService.atualizar(id, regiao)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {

        regiaoService.deletar(id);

        return ResponseEntity.noContent().build();
    }
}