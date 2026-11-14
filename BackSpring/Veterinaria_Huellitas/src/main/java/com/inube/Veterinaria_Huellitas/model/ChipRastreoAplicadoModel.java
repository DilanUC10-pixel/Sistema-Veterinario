package com.inube.Veterinaria_Huellitas.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "CHIP_APLICADO")
@Data
public class ChipRastreoAplicadoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_chip_aplicado")
    @SequenceGenerator(name = "seq_chip_aplicado", sequenceName = "SEQ_CHIP_APLICADO", allocationSize = 1)
    @Column(name = "IDCHIPAPLICADO")
    private Integer idChipAplicado;

    @Column(name = "IDMASCOTA", nullable = false)
    private Integer idMascota;

    @Column(name = "IDCHIPSTOCK", nullable = false, unique = true)
    private Integer idChipStock;

    @Column(name = "FECHAIMPLEMENTACION")
    private LocalDateTime fechaImplementacion = LocalDateTime.now();
}
