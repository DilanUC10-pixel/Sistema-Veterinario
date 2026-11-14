package com.inube.Veterinaria_Huellitas.dto;

import lombok.Data;

@Data
public class VacunaAplicadaRequest {
    private Integer idMascota;
    private Integer idVacuna;
    private Integer cantidad;
    private String observaciones;
}