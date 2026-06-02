package br.unioeste.napirotas.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "rotas")
public class Rotas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> autoresResponsaveisID;

    private String nomeRota;

    @ElementCollection
    private List<String> pontoOrigem;

    @ElementCollection
    private List<String> pontos;

    /*@ElementCollection
    @CollectionTable(name = "rota_pontos", joinColumns = @JoinColumn(name = "rota_id"))
    private List<Ponto> pontos;
    */
   
    @ElementCollection
    private List<String> clusters;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String matrizCustoGlobal;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String matrizCustoClusters;

    private float custoTotal;
    private float tempoTotal;

    // =========================
    // GETTERS E SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getAutoresResponsaveisID() {
        return autoresResponsaveisID;
    }

    public void setAutoresResponsaveisID(List<String> autoresResponsaveisID) {
        this.autoresResponsaveisID = autoresResponsaveisID;
    }

    public String getNomeRota() {
        return nomeRota;
    }

    public void setNomeRota(String nomeRota) {
        this.nomeRota = nomeRota;
    }

    public List<String> getPontoOrigem() {
        return pontoOrigem;
    }

    public void setPontoOrigem(List<String> pontoOrigem) {
        this.pontoOrigem = pontoOrigem;
    }

    public List<String> getPontos() {
        return pontos;
    }

    public void setPontos(List<String> pontos) {
        this.pontos = pontos;
    }

    public List<String> getClusters() {
        return clusters;
    }

    public void setClusters(List<String> clusters) {
        this.clusters = clusters;
    }

    public String getMatrizCustoGlobal() {
        return matrizCustoGlobal;
    }

    public void setMatrizCustoGlobal(String matrizCustoGlobal) {
        this.matrizCustoGlobal = matrizCustoGlobal;
    }

    public String getMatrizCustoClusters() {
        return matrizCustoClusters;
    }

    public void setMatrizCustoClusters(String matrizCustoClusters) {
        this.matrizCustoClusters = matrizCustoClusters;
    }

    public float getCustoTotal() {
        return custoTotal;
    }

    public void setCustoTotal(float custoTotal) {
        this.custoTotal = custoTotal;
    }

    public float getTempoTotal() {
        return tempoTotal;
    }

    public void setTempoTotal(float tempoTotal) {
        this.tempoTotal = tempoTotal;
    }
}