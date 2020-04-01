package ru.mycrg.data_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import ru.mycrg.data_service.validators.ValidateEnum;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseMapCreateDto {

    @NotBlank
    @Length(max = 255)
    private String name;

    @NotBlank
    @Length(min = 3, max = 255)
    private String title;

    @NotBlank
    @Length(min = 3, max = 255)
    private String thumbnailUrn;

    @NotBlank
    @ValidateEnum(targetClassType = SourceType.class, message = "Please provide correct ENUM value: OSM, XYZ, WMTS")
    private String type;

    @Length(max = 255)
    private String url;

    @Length(max = 255)
    private String layerName;

    @Length(max = 50)
    private String style;

    @Length(max = 20)
    private String projection;

    @Length(max = 20)
    private String format;

    @Min(1)
    @Max(Integer.MAX_VALUE)
    private Integer size;

    @Min(1)
    @Max(Integer.MAX_VALUE)
    private Integer resolution;

    @Min(1)
    @Max(Integer.MAX_VALUE)
    private Integer matrixIds;

}
