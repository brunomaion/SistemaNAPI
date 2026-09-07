package br.unioeste.napirotas.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.napirotas.model.Grupo;

public interface GrupoRepository extends JpaRepository<Grupo, Long> {

    List<Grupo> findByRegiaoId(Long regiaoId);

    Optional<Grupo> findByRegiaoIdAndNumero(Long regiaoId, Integer numero);
}