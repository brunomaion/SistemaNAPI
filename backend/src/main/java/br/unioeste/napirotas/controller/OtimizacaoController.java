package br.unioeste.napirotas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.unioeste.napirotas.model.Grupo;
import br.unioeste.napirotas.service.OtimizacaoService;

@RestController
@RequestMapping("/regioes/{regiaoId}/otimizacao")
@CrossOrigin(origins = "http://localhost:5173")
public class OtimizacaoController {

    private final OtimizacaoService otimizacaoService;

    public OtimizacaoController(OtimizacaoService otimizacaoService) {
        this.otimizacaoService = otimizacaoService;
    }

    @PostMapping("/clusterizar")
    public ResponseEntity<List<Grupo>> clusterizar(
            @PathVariable Long regiaoId,
            @RequestParam(defaultValue = "3") int numGrupos) {

        return ResponseEntity.ok(
                otimizacaoService.clusterizar(regiaoId, numGrupos));
    }
}
