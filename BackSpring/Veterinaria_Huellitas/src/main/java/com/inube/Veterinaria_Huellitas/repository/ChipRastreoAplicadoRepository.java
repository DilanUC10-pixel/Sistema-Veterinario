package com.inube.Veterinaria_Huellitas.repository;

import com.inube.Veterinaria_Huellitas.model.ChipRastreoAplicadoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChipRastreoAplicadoRepository extends JpaRepository<ChipRastreoAplicadoModel, Integer> {
    @Query("""
            SELECT c
            FROM ChipRastreoAplicadoModel c
            WHERE c.idMascota = :idMascota
            ORDER BY c.fechaImplementacion DESC
            """)
    List<ChipRastreoAplicadoModel> findByMascotaIdMascota(@Param("idMascota") Integer idMascota);
}
