package ru.mycrg.gis_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupCreateDto {

    @NotBlank
    @Length(min = 3, max = 255)
    private String title;

    @CrgParentGroup
    private Long parent;

    @Max(Integer.MAX_VALUE)
    private int position = -1;

}
