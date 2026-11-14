package com.inube.Veterinaria_Huellitas.service;

import com.inube.Veterinaria_Huellitas.dto.VacunaAplicadaRequest;
import com.inube.Veterinaria_Huellitas.model.MascotaModel;
import com.inube.Veterinaria_Huellitas.model.VacunaAplicadaModel;
import com.inube.Veterinaria_Huellitas.model.VacunaStockModel;
import com.inube.Veterinaria_Huellitas.repository.MascotaRepository;
import com.inube.Veterinaria_Huellitas.repository.VacunaStockRepository;
import com.inube.Veterinaria_Huellitas.repository.VacunasAplicadasRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

@Service
@RequiredArgsConstructor
public class VacunasAplicadasService {
    private final MascotaRepository mascotaRepository;
    private final VacunasAplicadasRepository vacunasAplicadasRepository;
    private final VacunaStockRepository vacunaStockRepository;

    @Transactional
    public VacunaAplicadaModel aplicarVacuna(VacunaAplicadaRequest request) {
        if (request.getIdMascota() == null) {
            throw new IllegalArgumentException("El ID de la mascota es obligatorio");
        }
        if (request.getIdVacuna() == null) {
            throw new IllegalArgumentException("El ID de la vacuna es obligatorio");
        }
        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
        }

        MascotaModel mascota = mascotaRepository.findById(request.getIdMascota())
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
        if (CODENEG.equals(mascota.getEstado())) {
            throw new IllegalArgumentException("La mascota no está activa");
        }

        VacunaStockModel vacuna = vacunaStockRepository.findById(request.getIdVacuna())
                .orElseThrow(() -> new RuntimeException(MSG18));
        if (!CODEPOS.equals(vacuna.getEstado())) {
            throw new IllegalArgumentException("La vacuna no está activa");
        }

        if (vacuna.getStock() == null || vacuna.getStock() < request.getCantidad()) {
            throw new RuntimeException(MSG17 + vacuna.getNOMBREVACUNA());
        }

        VacunaAplicadaModel aplicada = new VacunaAplicadaModel();
        aplicada.setIDMASCOTA(mascota.getIDMASCOTA());
        aplicada.setIDVACUNA(vacuna.getIDVACUNA());
        aplicada.setFECHAAPLICACION(LocalDateTime.now());

        aplicada = vacunasAplicadasRepository.save(aplicada);

        vacuna.setStock(vacuna.getStock() - request.getCantidad());
        vacunaStockRepository.save(vacuna);

        return aplicada;
    }

    public List<VacunaAplicadaModel> historialPorMascota(Integer idMascota) {
        return vacunasAplicadasRepository.findByMascotaIdMascota(idMascota);
    }
}
