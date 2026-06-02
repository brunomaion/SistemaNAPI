package br.unioeste.napirotas.controller;


import br.unioeste.napirotas.dto.LoginRequest;
import br.unioeste.napirotas.dto.LoginResponse;
import br.unioeste.napirotas.dto.CadastroResponse;
import br.unioeste.napirotas.model.Usuario;
import br.unioeste.napirotas.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public CadastroResponse criar(@RequestBody Usuario usuario) {
        return service.cadastrar(usuario);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            return service.atualizar(id, usuario);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
    return service.verificarCredenciais(
            request.username(),
            request.senha()
    );
    }
}