package com.inube.Veterinaria_Huellitas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

import static com.inube.Veterinaria_Huellitas.util.UtilConstants.CODEPOS;

@Entity
@Table(name = "citas_seguimiento")
@Data
public class CitaSeguimientoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_citas_seguimiento")
    @SequenceGenerator(name = "seq_citas_seguimiento", sequenceName = "seq_citas_seguimiento", allocationSize = 1)
    @Column(name = "IDCITA")
    private Integer IDCITA;

    @Column(name = "IDMASCOTA", nullable = false)
    private Integer IDMASCOTA;

    @Column(name = "FECHACITA", nullable = false)
    private LocalDateTime FECHACITA;

    @Column(name = "motivo", nullable = false, length = 250)
    private String motivo;

    @Column(name = "observaciones", length = 1000)
    private String observaciones;

    @Column(name = "estado")
    private Integer estado = CODEPOS;
}
