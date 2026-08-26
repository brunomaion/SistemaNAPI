package br.unioeste.napirotas.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "coletas")
public class Coletas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeColeta;

    private LocalDate dataInicio;

    private LocalDate dataFim;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<Ponto> pontos = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<Grupo> grupos = new ArrayList<>();

    public static class Grupo {

        private Long id;

        private List<Integer> pontos = new ArrayList<>();

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public List<Integer> getPontos() { return pontos; }
        public void setPontos(List<Integer> pontos) { this.pontos = pontos; }
    }

    public static class Ponto {

        private Long id;

        private String nome;

        private Double latitude;

        private Double longitude;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeColeta() { return nomeColeta; }
    public void setNomeColeta(String nomeColeta) { this.nomeColeta = nomeColeta; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    public List<Ponto> getPontos() { return pontos; }
    public void setPontos(List<Ponto> pontos) { this.pontos = pontos; }
    public List<Grupo> getGrupos() { return grupos; }
    public void setGrupos(List<Grupo> grupos) { this.grupos = grupos; }

}