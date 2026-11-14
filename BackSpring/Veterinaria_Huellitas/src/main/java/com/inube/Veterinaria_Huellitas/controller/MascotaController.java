package com.inube.Veterinaria_Huellitas.controller;
import com.inube.Veterinaria_Huellitas.dto.ApiResponse;
import com.inube.Veterinaria_Huellitas.model.MascotaModel;
import com.inube.Veterinaria_Huellitas.service.MascotaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

@RestController
@RequestMapping("/api/mascotas")
@RequiredArgsConstructor
@Tag(name = "Mascota", description = "Controlador para gestionar mascotas")
public class MascotaController {

    private final MascotaService service;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> guardar(@RequestBody MascotaModel mascota) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG11, service.guardar(mascota)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> listar() {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.listar()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.buscarPorId(id)));
    }

    @GetMapping("/adoptante/{idAdoptante}")
    public ResponseEntity<ApiResponse<?>> listarPorAdoptante(@PathVariable Integer idAdoptante) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.listarPorAdoptante(idAdoptante)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> actualizar(@PathVariable Integer id, @RequestBody MascotaModel mascota) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG12, service.actualizar(id, mascota)));
    }

    @PutMapping("/{id}/adopcion")
    public ResponseEntity<ApiResponse<?>> actualizarEstadoAdopcion(@PathVariable Integer id, @RequestBody MascotaModel mascota) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG12, service.actualizarEstadoAdopcion(id, mascota)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.ok(new ApiResponse<>(true, MSG13, null));
    }
}
