package br.unioeste.napirotas.repository;

import br.unioeste.napirotas.model.Rotas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RotasRepository extends JpaRepository<Rotas, Long> {
}