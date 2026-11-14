package com.inube.Veterinaria_Huellitas.repository;

import com.inube.Veterinaria_Huellitas.model.VacunaAplicadaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacunasAplicadasRepository extends JpaRepository<VacunaAplicadaModel, Integer> {

    @Query("""
            SELECT a
            FROM VacunaAplicadaModel a
            WHERE a.IDMASCOTA = :idMascota
            ORDER BY a.FECHAAPLICACION DESC
            """)
    List<VacunaAplicadaModel> findByMascotaIdMascota(@Param("idMascota") Integer idMascota);
}