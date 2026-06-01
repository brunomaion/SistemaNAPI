package br.unioeste.napirotas.service;

import br.unioeste.napirotas.model.Usuario;
import br.unioeste.napirotas.dto.LoginResponse;
import br.unioeste.napirotas.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Usuario salvar(Usuario usuario) {
        return repository.save(usuario);
    }

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public LoginResponse verificarCredenciais(String username, String senha) {

        Usuario usuario = repository.findByUsername(username).orElse(null);

        if (usuario == null) {
            return new LoginResponse(
                    false,
                    "Usuário não encontrado"
            );
        }

        if (!usuario.getSenha().equals(senha)) {
            return new LoginResponse(
                    false,
                    "Senha incorreta"
            );
        }

        return new LoginResponse(
                true,
                "Login realizado com sucesso"
        );
    }

    public Usuario atualizar(Long id, Usuario usuario) {
        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado"));

        if (usuario.getUsername() != null) {
            existente.setUsername(usuario.getUsername());
        }
        if (usuario.getNome() != null) {
            existente.setNome(usuario.getNome());
        }
        if (usuario.getEmail() != null) {
            existente.setEmail(usuario.getEmail());
        }
        if (usuario.getSenha() != null) {
            existente.setSenha(usuario.getSenha());
        }
        if (usuario.getTelefone() != null) {
            existente.setTelefone(usuario.getTelefone());
        }
        if (usuario.getEndereco() != null) {
            existente.setEndereco(usuario.getEndereco());
        }

        return repository.save(existente);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Usuário não encontrado");
        }
        repository.deleteById(id);
    }
}