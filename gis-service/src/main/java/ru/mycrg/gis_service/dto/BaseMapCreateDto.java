package ru.mycrg.gis_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseMapCreateDto {

    @Min(1)
    @Max(Long.MAX_VALUE)
    private long baseMapId;

    @NotBlank
    @Length(min = 3, max = 255)
    private String title;

    @Max(Integer.MAX_VALUE)
    private int position = -1;

}
