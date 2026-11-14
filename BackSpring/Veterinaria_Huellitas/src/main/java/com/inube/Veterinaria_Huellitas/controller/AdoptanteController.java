package com.inube.Veterinaria_Huellitas.controller;

import com.inube.Veterinaria_Huellitas.dto.ApiResponse;
import com.inube.Veterinaria_Huellitas.dto.LoginRequest;
import com.inube.Veterinaria_Huellitas.model.AdoptanteModel;
import com.inube.Veterinaria_Huellitas.service.AdoptanteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

@RestController
@RequestMapping("/api/adoptantes")
@RequiredArgsConstructor
@Tag(name = "Adoptante", description = "Controlador para gestionar adoptantes")
public class AdoptanteController {

    private final AdoptanteService service;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> iniciarSesion(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Inicio de sesión exitoso", service.iniciarSesion(request)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> guardar(@RequestBody AdoptanteModel adoptante) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG8, service.guardar(adoptante)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> listar() {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.listar()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG1, service.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> actualizar(@PathVariable Integer id, @RequestBody AdoptanteModel adoptante) {
        return ResponseEntity.ok(new ApiResponse<>(true, MSG9, service.actualizar(id, adoptante)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.ok(new ApiResponse<>(true, MSG10, null));
    }
}
