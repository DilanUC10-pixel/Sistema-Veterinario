package com.inube.Veterinaria_Huellitas.controller;

import com.inube.Veterinaria_Huellitas.dto.ApiResponse;
import com.inube.Veterinaria_Huellitas.model.CitaSeguimientoModel;
import com.inube.Veterinaria_Huellitas.service.CitaSeguimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.MSG1;

@RestController
@RequestMapping("/api/citas-seguimiento")
@RequiredArgsConstructor
public class CitaSeguimientoController {
    private final CitaSeguimientoService service;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> guardar(@RequestBody CitaSeguimientoModel cita) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Cita de seguimiento registrada correctamente", service.guardar(cita)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> listar() {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.listar()));
    }

    @GetMapping("/mascota/{idMascota}")
    public ResponseEntity<ApiResponse<?>> listarPorMascota(@PathVariable Integer idMascota) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.listarPorMascota(idMascota)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> actualizar(
            @PathVariable Integer id,
            @RequestBody CitaSeguimientoModel cita) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Cita de seguimiento actualizada correctamente", service.actualizar(id, cita)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> eliminar(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Cita de seguimiento eliminada correctamente", service.eliminar(id)));
    }
}
