package com.inube.Veterinaria_Huellitas.repository;

import com.inube.Veterinaria_Huellitas.model.MascotaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<MascotaModel, Integer> {
    List<MascotaModel> findByEstado(Integer estado);
    List<MascotaModel> findByEstadoIn(List<Integer> estados);

    @Query("SELECT m FROM MascotaModel m WHERE m.IDADOPTANTE = :idAdoptante AND m.estado <> :estadoEliminada")
    List<MascotaModel> buscarPorAdoptante(@Param("idAdoptante") Integer idAdoptante,
                                          @Param("estadoEliminada") Integer estadoEliminada);
}
