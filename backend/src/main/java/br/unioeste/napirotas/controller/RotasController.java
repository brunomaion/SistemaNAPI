package br.unioeste.napirotas.controller;

import br.unioeste.napirotas.model.Rotas;
import br.unioeste.napirotas.service.RotasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rotas")
@CrossOrigin(origins = "*")
public class RotasController {

    private final RotasService service;

    public RotasController(RotasService service) {
        this.service = service;
    }

    @GetMapping
    public List<Rotas> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rotas> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    

    @PostMapping
    public Rotas criar(@RequestBody Rotas rota) {
        return service.salvar(rota);
    }

    @PutMapping("/{id}")
    public Rotas atualizar(@PathVariable Long id, @RequestBody Rotas rota) {
        return service.atualizar(id, rota);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}