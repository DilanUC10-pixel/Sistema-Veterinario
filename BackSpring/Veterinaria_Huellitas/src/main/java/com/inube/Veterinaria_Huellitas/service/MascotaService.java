package com.inube.Veterinaria_Huellitas.service;

import com.inube.Veterinaria_Huellitas.model.MascotaModel;
import com.inube.Veterinaria_Huellitas.model.AdoptanteModel;
import com.inube.Veterinaria_Huellitas.repository.AdoptanteRepository;
import com.inube.Veterinaria_Huellitas.repository.MascotaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

import java.util.List;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class MascotaService {
    private final MascotaRepository repository;
    private final AdoptanteRepository adoptanteRepository;

    public MascotaModel guardar(MascotaModel mascota) {
        if (mascota.getIDADOPTANTE() == null) {
            throw new IllegalArgumentException("El ID del adoptante es obligatorio");
        }
        AdoptanteModel adoptante = adoptanteRepository.findById(mascota.getIDADOPTANTE())
                .orElseThrow(() -> new RuntimeException("Adoptante no encontrado"));
        if (!CODEPOS.equals(adoptante.getEstado())) {
            throw new IllegalArgumentException("El adoptante no está activo");
        }

        if (mascota.getEstado() == null) {
            mascota.setEstado(CODESEG);
        }
        mascota.setIDADOPTANTE(adoptante.getIDADOPTANTE());
        mascota.setFECHAADOPCION(LocalDateTime.now());
        return repository.save(mascota);
    }

    public List<MascotaModel> listar() {
        return repository.findByEstadoIn(List.of(CODESEG, CODEPOS));
    }

    public List<MascotaModel> listarPorAdoptante(Integer idAdoptante) {
        return repository.buscarPorAdoptante(idAdoptante, CODENEG);
    }

    public MascotaModel buscarPorId(Integer id){
        return repository.findById(id).orElseThrow(() ->new RuntimeException(MSG15));
    }

    public MascotaModel actualizar(Integer id, MascotaModel request) {
        // metodo para actualizar una mascota existente en la base de datos pero tambien
        // nos sirve para cambiar el estado de la mascota a adoptada o no adoptada

        MascotaModel mascota = buscarPorId(id);
        mascota.setNombre(request.getNombre());
        mascota.setEspecie(request.getEspecie());
        mascota.setRaza(request.getRaza());
        mascota.setEdad(request.getEdad());
        mascota.setSexo(request.getSexo());
        mascota.setFECHAADOPCION(request.getFECHAADOPCION());
        mascota.setIDADOPTANTE(request.getIDADOPTANTE());
        mascota.setEstado(request.getEstado());
        return repository.save(mascota);
    }

    public MascotaModel actualizarEstadoAdopcion(Integer id, MascotaModel request) {
        MascotaModel mascota = buscarPorId(id);
        Integer idAdoptante = request.getIDADOPTANTE();
        mascota.setIDADOPTANTE(idAdoptante);

        if (idAdoptante != null && !idAdoptante.equals(CODEPOS)) {
            mascota.setEstado(CODEPOS);
            mascota.setFECHAADOPCION(LocalDateTime.now());
        }

        return repository.save(mascota);
    }

    public MascotaModel eliminar(Integer id) {
        MascotaModel mascota = buscarPorId(id);
        mascota.setEstado(CODENEG);
        return repository.save(mascota);
    }

}
