package br.unioeste.napirotas.dto;

public record LoginResponse(
        boolean sucesso,
        String mensagem
) {
}