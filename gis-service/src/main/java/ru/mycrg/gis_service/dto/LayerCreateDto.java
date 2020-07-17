package ru.mycrg.gis_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LayerCreateDto {

    @NotBlank
    @Length(min = 2, max = 255)
    private String title;

    @NotBlank
    @Length(min = 2, max = 255)
    private String internalName;

    @NotBlank
    @Length(min = 2, max = 100)
    private String schemaId;

    @NotBlank
    @Length(min = 3, max = 100)
    private String dataStoreName;

    @NotBlank
    @Length(min = 6, max = 255)
    private String nativeCRS;

    @Pattern(regexp = "^(vector|raster|external)$", message = "Допустимые значения поля type: vector/raster/external")
    private String type;

}
