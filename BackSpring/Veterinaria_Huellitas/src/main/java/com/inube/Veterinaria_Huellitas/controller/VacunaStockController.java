package com.inube.Veterinaria_Huellitas.controller;

import com.inube.Veterinaria_Huellitas.dto.ApiResponse;
import com.inube.Veterinaria_Huellitas.model.VacunaStockModel;
import com.inube.Veterinaria_Huellitas.service.VacunaStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;


import java.util.List;

@RestController
@RequestMapping("/api/vacunas-stock")
@RequiredArgsConstructor
public class VacunaStockController {
    private final VacunaStockService service;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> crear(@RequestBody VacunaStockModel vacuna) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG11, service.guardar(vacuna)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<?>> listar() {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.listar()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> buscar(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> actualizar(@PathVariable Integer id, @RequestBody VacunaStockModel vacuna) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.actualizar(id, vacuna)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> eliminar(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.eliminar(id)));
    }
}