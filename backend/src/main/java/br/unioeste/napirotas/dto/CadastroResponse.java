package br.unioeste.napirotas.dto;

public record CadastroResponse(
        boolean sucesso,
        String mensagem,
        Long id,
        String username,
        String nome,
        String email
) {}