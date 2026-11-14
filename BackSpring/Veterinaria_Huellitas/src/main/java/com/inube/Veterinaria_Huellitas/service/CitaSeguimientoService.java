package com.inube.Veterinaria_Huellitas.service;

import com.inube.Veterinaria_Huellitas.model.CitaSeguimientoModel;
import com.inube.Veterinaria_Huellitas.repository.CitaSeguimientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

@Service
@RequiredArgsConstructor
public class CitaSeguimientoService {
    private final CitaSeguimientoRepository repository;

    public CitaSeguimientoModel guardar(CitaSeguimientoModel cita) {
        validarEstado(cita.getEstado());
        if (cita.getEstado() == null) {
            cita.setEstado(CODEPOS);
        }
        return repository.save(cita);
    }

    public List<CitaSeguimientoModel> listar() {
        return repository.findAll();
    }

    public List<CitaSeguimientoModel> listarPorMascota(Integer idMascota) {
        return repository.findByIDMASCOTA(idMascota);
    }

    public CitaSeguimientoModel buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita de seguimiento no encontrada"));
    }

    public CitaSeguimientoModel actualizar(Integer id, CitaSeguimientoModel request) {
        CitaSeguimientoModel cita = buscarPorId(id);
        validarEstado(request.getEstado());
        cita.setIDMASCOTA(request.getIDMASCOTA());
        cita.setFECHACITA(request.getFECHACITA());
        cita.setMotivo(request.getMotivo());
        cita.setObservaciones(request.getObservaciones());
        if (request.getEstado() != null) {
            cita.setEstado(request.getEstado());
        }
        return repository.save(cita);
    }

    public CitaSeguimientoModel eliminar(Integer id) {
        CitaSeguimientoModel cita = buscarPorId(id);
        cita.setEstado(CODENEG);
        return repository.save(cita);
    }

    private void validarEstado(Integer estado) {
        if (estado != null && estado != CODENEG && estado != CODEPOS && estado != CODESEG && estado != 3) {
            throw new IllegalArgumentException("El estado debe ser 0, 1, 2 o 3");
        }
    }
}
