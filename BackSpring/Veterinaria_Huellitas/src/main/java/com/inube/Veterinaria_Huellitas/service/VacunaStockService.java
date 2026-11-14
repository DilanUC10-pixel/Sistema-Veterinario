package com.inube.Veterinaria_Huellitas.service;

import com.inube.Veterinaria_Huellitas.model.VacunaStockModel;
import com.inube.Veterinaria_Huellitas.repository.VacunaStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VacunaStockService {
    private final VacunaStockRepository repository;

    public VacunaStockModel guardar(VacunaStockModel vacuna) {
        if (vacuna.getEstado() == null) {
            vacuna.setEstado(CODESEG);
        }
        return repository.save(vacuna);
    }

    public List<VacunaStockModel> listar(){ return repository.findByEstado(CODEPOS);}

    public VacunaStockModel buscarPorId(Integer id){
        return repository.findById(id).orElseThrow(() ->new RuntimeException(MSG18));
    }

    public VacunaStockModel actualizar(Integer id, VacunaStockModel request) {
        VacunaStockModel vacuna = buscarPorId(id);
        vacuna.setNOMBREVACUNA(request.getNOMBREVACUNA());
        vacuna.setDescripcion(request.getDescripcion());
        vacuna.setStock(request.getStock());
        vacuna.setEstado(request.getEstado());
        vacuna.setFECHAMODIFICACION(LocalDateTime.now());
        return repository.save(vacuna);
    }

    public VacunaStockModel eliminar(Integer id) {
        VacunaStockModel vacuna = buscarPorId(id);
        vacuna.setEstado(CODENEG);
        return repository.save(vacuna);
    }
}
