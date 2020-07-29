package ru.mycrg.gis_service.validators;

import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;
import ru.mycrg.gis_service.dto.LayerCreateDto;

@Log4j2
@Service
public class CrgLayerValidator implements Validator {

    private final SpringValidatorAdapter validator;

    public CrgLayerValidator(SpringValidatorAdapter validator) {
        super();

        this.validator = validator;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return validator.supports(clazz);
    }

    @Override
    public void validate(Object target, @NotNull Errors errors) {
        validator.validate(target, errors);

        LayerCreateDto dto = (LayerCreateDto) target;

        if ("vector".equals(dto.getType())) {
            if (dto.getNativeCRS() == null) {
                errors.rejectValue("nativeCRS", "nativeCRS", "Для векторного слоя является обязательным");
            }
            if (dto.getDataStoreName() == null) {
                errors.rejectValue("dataStoreName", "dataStoreName", "Для векторного слоя является обязательным");
            }
            if (dto.getSchemaId() == null) {
                errors.rejectValue("schemaId", "schemaId", "Для векторного слоя является обязательным");
            }
        } else if ("raster".equals(dto.getType())) {
            if (dto.getNativeCRS() == null) {
                errors.rejectValue("nativeCRS", "nativeCRS", "Для растрового слоя является обязательным");
            }
            if (dto.getDataStoreName() == null) {
                errors.rejectValue("dataStoreName", "dataStoreName", "Для растрового слоя является обязательным");
            }
        } else if ("external".equals(dto.getType())) {
            if (dto.getDataSourceUri() == null) {
                errors.rejectValue("dataSourceUri", "dataSourceUri", "Для внешнего слоя является обязательным");
            }
        } else {
            log.warn("Unsupported layer type: {}", dto.getType());
        }
    }
}
