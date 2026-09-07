package br.unioeste.napirotas.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Regiao")
@Getter
@Setter
public class Regiao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeRegiao;

    private LocalDate dataInicio;

    private LocalDate dataFim;

    @OneToMany(mappedBy = "regiao", cascade = CascadeType.ALL)
    private List<Pontos> pontos = new ArrayList<>();

    // Se quiser manter os grupos
    // @JdbcTypeCode(SqlTypes.JSON)
    // @Column(columnDefinition = "json")
    // private List<Grupo> grupos = new ArrayList<>();
}