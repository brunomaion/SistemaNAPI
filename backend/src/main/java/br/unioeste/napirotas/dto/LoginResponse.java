package br.unioeste.napirotas.dto;

public record LoginResponse(
        int id,
        boolean sucesso,
        String mensagem
) {
}