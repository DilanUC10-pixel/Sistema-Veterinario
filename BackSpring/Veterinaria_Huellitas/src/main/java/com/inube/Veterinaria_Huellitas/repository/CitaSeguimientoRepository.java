package com.inube.Veterinaria_Huellitas.repository;

import com.inube.Veterinaria_Huellitas.model.CitaSeguimientoModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CitaSeguimientoRepository extends JpaRepository<CitaSeguimientoModel, Integer> {
    List<CitaSeguimientoModel> findByIDMASCOTA(Integer idMascota);
}
