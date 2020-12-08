package ru.mycrg.gis_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupUpdateDto {

    @Length(min = 1, max = 255)
    private String title;

    @CrgParentGroup
    private Long parent;

    @Min(message = "Минимальное допустимое значение -1", value = -1)
    @Max(Integer.MAX_VALUE)
    private int position = -1;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля expanded: true или false")
    private String expanded;

    @Min(message = "Минимальное значение прозрачности 0", value = -1)
    @Max(message = "Максимальное значение прозрачности 100", value = 100)
    private int transparency = -1;

}
