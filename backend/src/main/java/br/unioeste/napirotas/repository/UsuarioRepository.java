package br.unioeste.napirotas.repository;

import br.unioeste.napirotas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {
}