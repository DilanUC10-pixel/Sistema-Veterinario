package com.inube.Veterinaria_Huellitas.controller;

import com.inube.Veterinaria_Huellitas.dto.VacunaAplicadaRequest;
import com.inube.Veterinaria_Huellitas.model.VacunaAplicadaModel;
import com.inube.Veterinaria_Huellitas.service.VacunasAplicadasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacunas-aplicadas")
@RequiredArgsConstructor
public class VacunasAplicadasController {
    private final VacunasAplicadasService service;

    @PostMapping
    public ResponseEntity<VacunaAplicadaModel> aplicarVacuna(@RequestBody VacunaAplicadaRequest request) {
        return ResponseEntity.ok(service.aplicarVacuna(request));
    }

    @GetMapping("/mascota/{idMascota}")
    public ResponseEntity<List<VacunaAplicadaModel>> historial(@PathVariable Integer idMascota) {
        return ResponseEntity.ok(service.historialPorMascota(idMascota));
    }
}