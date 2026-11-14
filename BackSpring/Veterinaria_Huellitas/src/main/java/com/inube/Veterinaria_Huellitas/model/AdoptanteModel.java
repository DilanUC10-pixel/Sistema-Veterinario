package com.inube.Veterinaria_Huellitas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

@Entity
@Table(name = "adoptantes")
@Data
public class AdoptanteModel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_adoptantes")
    @SequenceGenerator(name = "seq_adoptantes", sequenceName = "seq_adoptantes", allocationSize = 1)
    @Column(name = "IDADOPTANTE")
    private Integer IDADOPTANTE;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "APELLIDOMATERNO")
    private String apellidoMaterno;

    @Column(name = "APELLIDOPATERNO")
    private String apellidoPaterno;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "correo")
    private String correo;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "estado", nullable = false)
    private Integer estado = CODEPOS;

    @Column(name = "FECHAREGISTRO")
    private LocalDateTime FECHAREGISTRO = LocalDateTime.now();

    @Column(name = "contrasena")
    private String contrasena;

    @Column(name = "rol", nullable = false)
    private Integer rol = CODENEG;
}
