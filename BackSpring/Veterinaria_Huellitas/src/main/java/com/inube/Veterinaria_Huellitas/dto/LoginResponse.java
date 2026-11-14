package com.inube.Veterinaria_Huellitas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Integer id;
    private String nombre;
    private String correo;
    private Integer rol;
}
