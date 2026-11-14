package com.inube.Veterinaria_Huellitas.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "chip_stock")
@Data
public class ChipRastreoStockModel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_chip_stock")
    @SequenceGenerator(name = "seq_chip_stock", sequenceName = "seq_chip_stock", allocationSize = 1)
    @Column(name = "IDCHIPSTOCK")
    private Integer idChipStock;

    @Column(name = "CODIGOCHIP", nullable = false, length = 100, unique = true)
    private String codigoChip;

    @Column(name = "fabricante", length = 100)
    private String fabricante;

    @Column(name = "estado", nullable = false)
    private Integer estado = 2;
}
