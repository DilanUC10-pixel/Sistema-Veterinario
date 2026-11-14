package com.inube.Veterinaria_Huellitas.controller;

import com.inube.Veterinaria_Huellitas.dto.ChipRastreoAplicadoRequest;
import com.inube.Veterinaria_Huellitas.model.ChipRastreoAplicadoModel;
import com.inube.Veterinaria_Huellitas.service.ChipRastreoAplicadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/chips-rastreo-aplicado", "/api/chips-rastreo-aplicados"})
@RequiredArgsConstructor
public class ChipRastreoAplicadoController {
    private final ChipRastreoAplicadoService service;

    @PostMapping
    public ResponseEntity<ChipRastreoAplicadoModel> aplicar(@RequestBody ChipRastreoAplicadoRequest request) {
        return ResponseEntity.ok(service.aplicar(request));
    }

    @GetMapping("/mascota/{idMascota}")
    public ResponseEntity<List<ChipRastreoAplicadoModel>> historial(@PathVariable Integer idMascota) {
        return ResponseEntity.ok(service.historialPorMascota(idMascota));
    }
}
