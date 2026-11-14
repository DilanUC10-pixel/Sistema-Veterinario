package com.inube.Veterinaria_Huellitas.controller;

import com.inube.Veterinaria_Huellitas.dto.ApiResponse;
import com.inube.Veterinaria_Huellitas.model.ChipRastreoStockModel;
import com.inube.Veterinaria_Huellitas.service.ChipRastreoStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.MSG1;

@RestController
@RequestMapping("/api/chips-rastreo-stock")
@RequiredArgsConstructor
public class ChipRastreoStockController {
    private final ChipRastreoStockService service;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> crear(@RequestBody ChipRastreoStockModel chip) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Chip de rastreo registrado correctamente", service.guardar(chip)));
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
    public ResponseEntity<ApiResponse<?>> actualizar(@PathVariable Integer id, @RequestBody ChipRastreoStockModel chip) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Chip de rastreo actualizado correctamente", service.actualizar(id, chip)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> eliminar(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Chip de rastreo eliminado correctamente", service.eliminar(id)));
    }
}
