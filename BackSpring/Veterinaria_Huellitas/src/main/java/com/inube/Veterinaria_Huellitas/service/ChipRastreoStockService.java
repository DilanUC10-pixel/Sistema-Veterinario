package com.inube.Veterinaria_Huellitas.service;

import com.inube.Veterinaria_Huellitas.model.ChipRastreoStockModel;
import com.inube.Veterinaria_Huellitas.repository.ChipRastreoStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

@Service
@RequiredArgsConstructor
public class ChipRastreoStockService {
    private final ChipRastreoStockRepository repository;

    public ChipRastreoStockModel guardar(ChipRastreoStockModel chip) {
        if (chip.getEstado() == null) {
            chip.setEstado(2);
        }
        validarEstado(chip.getEstado());
        return repository.save(chip);
    }

    public List<ChipRastreoStockModel> listar() {
        return repository.findByEstado(2);
    }

    public ChipRastreoStockModel buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chip de rastreo no encontrado"));
    }

    public ChipRastreoStockModel actualizar(Integer id, ChipRastreoStockModel request) {
        ChipRastreoStockModel chip = buscarPorId(id);
        chip.setCodigoChip(request.getCodigoChip());
        chip.setFabricante(request.getFabricante());
        if (request.getEstado() != null) {
            validarEstado(request.getEstado());
            chip.setEstado(request.getEstado());
        }
        return repository.save(chip);
    }

    public ChipRastreoStockModel eliminar(Integer id) {
        ChipRastreoStockModel chip = buscarPorId(id);
        chip.setEstado(CODENEG);
        return repository.save(chip);
    }

    private void validarEstado(Integer estado) {
        if (estado == null || (estado != 0 && estado != 1 && estado != 2)) {
            throw new IllegalArgumentException("El estado del chip debe ser 0, 1 o 2");
        }
    }
}
