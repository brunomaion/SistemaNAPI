package br.unioeste.napirotas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.napirotas.model.Coletas;

public interface ColetasRepository extends JpaRepository<Coletas, Long> {
}