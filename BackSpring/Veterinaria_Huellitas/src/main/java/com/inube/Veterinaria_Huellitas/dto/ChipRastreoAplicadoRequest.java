package com.inube.Veterinaria_Huellitas.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class ChipRastreoAplicadoRequest {
    private Integer idMascota;

    @JsonAlias("idChip")
    private Integer idChipStock;
}
