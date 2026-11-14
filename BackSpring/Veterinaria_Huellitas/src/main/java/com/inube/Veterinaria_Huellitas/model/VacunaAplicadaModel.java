package com.inube.Veterinaria_Huellitas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "vacunas_aplicadas")
@Data
public class VacunaAplicadaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_vacunas_aplicadas")
    @SequenceGenerator(name = "seq_vacunas_aplicadas", sequenceName = "seq_vacunas_aplicadas", allocationSize = 1)
    @Column(name = "IDAPLICACION")
    private Integer IDAPLICACION;

    @Column(name = "IDMASCOTA")
    private Integer IDMASCOTA;

    @Column(name = "IDVACUNA")
    private Integer IDVACUNA;

    @Column(name = "FECHAAPLICACION")
    private LocalDateTime FECHAAPLICACION = LocalDateTime.now();
}
