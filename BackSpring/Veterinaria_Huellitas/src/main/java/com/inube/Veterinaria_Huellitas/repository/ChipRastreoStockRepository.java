package com.inube.Veterinaria_Huellitas.repository;

import com.inube.Veterinaria_Huellitas.model.ChipRastreoStockModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChipRastreoStockRepository extends JpaRepository<ChipRastreoStockModel, Integer> {
    List<ChipRastreoStockModel> findByEstado(Integer estado);
}
