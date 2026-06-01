package br.unioeste.napirotas.repository;
import java.util.Optional;
import br.unioeste.napirotas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<Usuario> findByUsername(String username);
}
