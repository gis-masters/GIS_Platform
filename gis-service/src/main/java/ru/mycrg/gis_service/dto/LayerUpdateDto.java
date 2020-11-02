package ru.mycrg.gis_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LayerUpdateDto {

    @Length(min = 2, max = 255)
    private String title;

    @NotBlank
    @Length(min = 2, max = 255)
    private String dataset;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    @Min(message = "Минимальное допустимое значение -1", value = -1)
    @Max(Integer.MAX_VALUE)
    private int position = -1;

    @Min(message = "Минимальное значение прозрачности 0", value = -1)
    @Max(message = "Максимальное значение прозрачности 100", value = 100)
    private int transparency = -1;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int minZoom;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int maxZoom;

    @CrgParentGroup
    private Long groupId;

    @NotBlank
    @Length(min = 6, max = 255)
    private String nativeCRS;

}
