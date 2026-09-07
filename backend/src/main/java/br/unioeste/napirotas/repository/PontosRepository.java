package br.unioeste.napirotas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.napirotas.model.Pontos;

public interface PontosRepository extends JpaRepository<Pontos, Long> {

    List<Pontos> findByGrupoId(Long grupoId);

    List<Pontos> findByGrupoRegiaoId(Long regiaoId);
}