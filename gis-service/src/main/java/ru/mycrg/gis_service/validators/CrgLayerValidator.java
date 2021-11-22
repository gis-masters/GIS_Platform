package ru.mycrg.gis_service.validators;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;
import ru.mycrg.gis_service.dto.LayerCreateDto;

@Service
public class CrgLayerValidator implements Validator {

    private final Logger log = LoggerFactory.getLogger(CrgLayerValidator.class);

    public static final String REQUIRED = "required";
    public static final String DEFAULT_V_MESSAGE = "Для векторного слоя является обязательным";
    public static final String DEFAULT_R_MESSAGE = "Для растрового слоя является обязательным";

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
        String type = dto.getType();
        if (type == null) {
            return;
        }

        switch (type) {
            case "vector":
                validateAsVector(errors, dto);
                break;
            case "raster":
                validateAsRaster(errors, dto);
                break;
            case "external":
                validateAsExternal(errors, dto);
                break;
            default:
                log.warn("Unsupported layer type: {}", type);
                break;
        }
    }

    private void validateAsVector(@NotNull Errors errors, LayerCreateDto dto) {
        if (dto.getNativeCRS() == null) {
            errors.rejectValue("nativeCRS", REQUIRED, DEFAULT_V_MESSAGE);
        }

        if (dto.getDataStoreName() == null) {
            errors.rejectValue("dataStoreName", REQUIRED, DEFAULT_V_MESSAGE);
        }

        if (dto.getSchemaId() == null) {
            errors.rejectValue("schemaId", REQUIRED, DEFAULT_V_MESSAGE);
        }

        if (dto.getStyleName() == null) {
            errors.rejectValue("styleName", REQUIRED, DEFAULT_V_MESSAGE);
        }

        if (dto.getDataset() == null) {
            errors.rejectValue("dataset", REQUIRED, DEFAULT_V_MESSAGE);
        }
    }

    private void validateAsRaster(@NotNull Errors errors, LayerCreateDto dto) {
        if (dto.getNativeCRS() == null) {
            errors.rejectValue("nativeCRS", REQUIRED, DEFAULT_R_MESSAGE);
        }

        if (dto.getDataStoreName() == null) {
            errors.rejectValue("dataStoreName", REQUIRED, DEFAULT_R_MESSAGE);
        }

        if (dto.getDataSourceUri() == null) {
            errors.rejectValue("dataSourceUri", REQUIRED, DEFAULT_R_MESSAGE);
        }

        if (dto.getLibraryId() == null) {
            errors.rejectValue("libraryId", REQUIRED, DEFAULT_R_MESSAGE);
        }

        if (dto.getRecordId() == null) {
            errors.rejectValue("recordId", REQUIRED, DEFAULT_R_MESSAGE);
        }
    }

    private void validateAsExternal(@NotNull Errors errors, LayerCreateDto dto) {
        if (dto.getDataSourceUri() == null) {
            errors.rejectValue("dataSourceUri", REQUIRED, "Для внешнего слоя является обязательным");
        }
    }
}
