package com.inube.Veterinaria_Huellitas.service;

import com.inube.Veterinaria_Huellitas.dto.ChipRastreoAplicadoRequest;
import com.inube.Veterinaria_Huellitas.model.ChipRastreoAplicadoModel;
import com.inube.Veterinaria_Huellitas.model.ChipRastreoStockModel;
import com.inube.Veterinaria_Huellitas.model.MascotaModel;
import com.inube.Veterinaria_Huellitas.repository.ChipRastreoAplicadoRepository;
import com.inube.Veterinaria_Huellitas.repository.ChipRastreoStockRepository;
import com.inube.Veterinaria_Huellitas.repository.MascotaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChipRastreoAplicadoService {
    private final MascotaRepository mascotaRepository;
    private final ChipRastreoAplicadoRepository aplicadoRepository;
    private final ChipRastreoStockRepository stockRepository;

    @Transactional
    public ChipRastreoAplicadoModel aplicar(ChipRastreoAplicadoRequest request) {
        if (request == null || request.getIdMascota() == null) {
            throw new IllegalArgumentException("El idMascota es obligatorio");
        }
        if (request.getIdChipStock() == null) {
            throw new IllegalArgumentException("El idChipStock es obligatorio");
        }

        MascotaModel mascota = mascotaRepository.findById(request.getIdMascota())
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        ChipRastreoStockModel chip = stockRepository.findById(request.getIdChipStock())
                .orElseThrow(() -> new RuntimeException("Chip de rastreo no encontrado"));

        if (chip.getEstado() == null || chip.getEstado() != 2) {
            throw new RuntimeException("El chip de rastreo no está disponible");
        }

        ChipRastreoAplicadoModel aplicado = new ChipRastreoAplicadoModel();
        aplicado.setIdMascota(mascota.getIDMASCOTA());
        aplicado.setIdChipStock(chip.getIdChipStock());
        aplicado.setFechaImplementacion(LocalDateTime.now());

        ChipRastreoAplicadoModel guardado = aplicadoRepository.save(aplicado);
        chip.setEstado(1);
        stockRepository.save(chip);
        return guardado;
    }

    public List<ChipRastreoAplicadoModel> historialPorMascota(Integer idMascota) {
        return aplicadoRepository.findByMascotaIdMascota(idMascota);
    }
}
