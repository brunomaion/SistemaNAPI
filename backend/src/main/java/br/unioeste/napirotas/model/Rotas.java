package br.unioeste.napirotas.model;

import jakarta.persistence.*;
import java.util.List;
import br.unioeste.napirotas.model.Ponto;

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
    @CollectionTable(name = "rota_origem", joinColumns = @JoinColumn(name = "rota_id"))
    private List<Ponto> pontoOrigem;

    //@ElementCollection
    //private List<String> pontos;

    @ElementCollection
    @CollectionTable(name = "rota_pontos", joinColumns = @JoinColumn(name = "rota_id"))
    private List<Ponto> pontos;


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

    public List<Ponto> getPontoOrigem() {
        return pontoOrigem;
    }

    public void setPontoOrigem(List<Ponto> pontoOrigem) {
        this.pontoOrigem = pontoOrigem;
    }

    public List<Ponto> getPontos() {
        return pontos;
    }

    public void setPontos(List<Ponto> pontos) {
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

    public void addPonto(Ponto ponto) {
        this.pontos.add(ponto);
    }
}