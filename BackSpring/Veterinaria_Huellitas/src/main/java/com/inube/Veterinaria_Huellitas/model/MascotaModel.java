package com.inube.Veterinaria_Huellitas.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

@Entity
@Table(name = "mascotas")
@Data
public class MascotaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_mascotas")
    @SequenceGenerator(name = "seq_mascotas", sequenceName = "seq_mascotas", allocationSize = 1)
    @Column(name = "IDMASCOTA")
    private Integer IDMASCOTA;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "especie")
    private String especie;

    @Column(name = "raza")
    private String raza;

    @Column(name = "edad")
    private Integer edad;

    @Column(name = "sexo", nullable = false)
    private Integer sexo;

    @Column(name = "FECHAINGRESO")
    private LocalDateTime FECHAINGRESO = LocalDateTime.now();

    @Column(name = "FECHAADOPCION")
    private LocalDateTime FECHAADOPCION;

    @Column(name = "IDADOPTANTE")
    @JsonProperty("idAdoptante")
    @JsonAlias({"IDADOPTANTE", "idadoptante"})
    private Integer IDADOPTANTE;

    @Column(name = "estado", nullable = false)
    private Integer estado = CODESEG;


}
