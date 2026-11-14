package com.inube.Veterinaria_Huellitas.repository;

import com.inube.Veterinaria_Huellitas.model.VacunaStockModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VacunaStockRepository extends JpaRepository<VacunaStockModel, Integer> {
    List<VacunaStockModel> findByEstado(Integer estado);

}