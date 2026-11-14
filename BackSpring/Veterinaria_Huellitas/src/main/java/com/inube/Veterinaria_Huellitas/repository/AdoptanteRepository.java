package com.inube.Veterinaria_Huellitas.repository;

import com.inube.Veterinaria_Huellitas.model.AdoptanteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdoptanteRepository extends JpaRepository<AdoptanteModel, Integer> {
    List<AdoptanteModel> findByEstado(Integer estado);
    Optional<AdoptanteModel> findByCorreoAndEstado(String correo, Integer estado);
}
