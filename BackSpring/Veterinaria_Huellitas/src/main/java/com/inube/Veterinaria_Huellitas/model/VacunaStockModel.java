package com.inube.Veterinaria_Huellitas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

@Entity
@Table(name = "vacunas_stock")
@Data
public class VacunaStockModel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_vacunas_stock")
    @SequenceGenerator(name = "seq_vacunas_stock", sequenceName = "seq_vacunas_stock", allocationSize = 1)
    @Column(name = "IDVACUNA")
    private Integer IDVACUNA;

    @Column(name = "NOMBREVACUNA")
    private String NOMBREVACUNA;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "FECHACREACION")
    private LocalDateTime FECHACREACION = LocalDateTime.now();

    @Column(name = "FECHAMODIFICACION")
    private LocalDateTime FECHAMODIFICACION;

    @Column(name = "estado", nullable = false)
    private Integer estado = CODEPOS;
}
