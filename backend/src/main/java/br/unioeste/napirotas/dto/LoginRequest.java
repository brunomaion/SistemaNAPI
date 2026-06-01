package br.unioeste.napirotas.dto;

public record LoginRequest(
        String username,
        String senha
) {
}