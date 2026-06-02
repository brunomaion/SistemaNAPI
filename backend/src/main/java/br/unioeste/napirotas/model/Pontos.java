package br.unioeste.napirotas.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Ponto {

    private String nome;
    private String lat;
    private String lng;

    public Ponto() {}

    public Ponto(String nome, String lat, String lng) {
        this.nome = nome;
        this.lat = lat;
        this.lng = lng;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLng() {
        return lng;
    }

    public void setLng(String lng) {
        this.lng = lng;
    }
}