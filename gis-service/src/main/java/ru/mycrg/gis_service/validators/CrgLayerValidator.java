package ru.mycrg.gis_service.validators;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;
import ru.mycrg.gis_service.dto.LayerCreateDto;

import static ru.mycrg.gis_service.service.layers.RasterLayerHandler.FULL_MODE;
import static ru.mycrg.gis_service.service.layers.RasterLayerHandler.GEOSERVER_MODE;

@Service
public class CrgLayerValidator implements Validator {

    private final Logger log = LoggerFactory.getLogger(CrgLayerValidator.class);

    static final String REQUIRED = "required";
    static final String DEFAULT_V_MESSAGE = "Для векторного слоя является обязательным";
    static final String DEFAULT_R_MESSAGE = "Для растрового слоя является обязательным";

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
            case "shp":
                validateAsShp(errors, dto);
                break;
            case "tab":
            case "mid":
            case "dxf":
                validateAsDxf(errors, dto);
                break;
            case "raster":
                validateAsRaster(errors, dto);
                break;
            case "external":
            case "external_nspd":
            case "external_geoserver":
                validateAsExternal(errors, dto);
                break;
            default:
                errors.rejectValue("type", "incorrect", "Не поддерживаемый тип слоя");

                log.warn("Не поддерживаемый тип слоя: {}", type);
                break;
        }
    }

    private void validateAsVector(@NotNull Errors errors, LayerCreateDto dto) {
        common(errors, dto);

        if (dto.getNativeCRS() == null) {
            errors.rejectValue("nativeCRS", REQUIRED, DEFAULT_V_MESSAGE);
        }

        if (dto.getDataset() == null) {
            errors.rejectValue("dataset", REQUIRED, DEFAULT_V_MESSAGE);
        }
    }

    private void validateAsDxf(@NotNull Errors errors, LayerCreateDto dto) {
        common(errors, dto);

        if (dto.getNativeCRS() == null) {
            errors.rejectValue("nativeCRS", REQUIRED, "является обязательным");
        }

        if (dto.getNativeName() == null) {
            errors.rejectValue("nativeName", REQUIRED, "является обязательным");
        }
    }

    private void validateAsShp(@NotNull Errors errors, LayerCreateDto dto) {
        common(errors, dto);

        if (dto.getNativeName() == null) {
            errors.rejectValue("nativeName", REQUIRED, "является обязательным");
        }
    }

    private void validateAsRaster(@NotNull Errors errors, LayerCreateDto dto) {
        // Для растра обязательно указание режима
        if (dto.getMode() == null) {
            errors.rejectValue("mode", REQUIRED, DEFAULT_R_MESSAGE);
        }

        if (dto.getNativeCRS() == null) {
            errors.rejectValue("nativeCRS", REQUIRED, DEFAULT_R_MESSAGE);
        }

        if (dto.getLibraryId() == null) {
            errors.rejectValue("libraryId", REQUIRED, DEFAULT_R_MESSAGE);
        }

        if (dto.getRecordId() == null) {
            errors.rejectValue("recordId", REQUIRED, DEFAULT_R_MESSAGE);
        }

        if (dto.getMode().equalsIgnoreCase(FULL_MODE) || dto.getMode().equalsIgnoreCase(GEOSERVER_MODE)) {
            // Для растра должен быть обязателен
            // или getDataSourceUri - на основе пути к файлу и gis сервис сам создаст хранилие на геосервере(актуален)
            // или dataStoreName - но тогда хранилищем gis сервис заниматься не должен.
            // Иначе мы не можем создать слой на геосервере.
            if (dto.getDataSourceUri() == null) {
                errors.rejectValue("dataSourceUri", REQUIRED, DEFAULT_R_MESSAGE);
            }

            // Используется как раз для формирования имени хранилища
            if (dto.getTableName() == null) {
                errors.rejectValue("tableName", REQUIRED, DEFAULT_R_MESSAGE);
            }
        }
    }

    private void validateAsExternal(@NotNull Errors errors, LayerCreateDto dto) {
        if (dto.getDataSourceUri() == null) {
            errors.rejectValue("dataSourceUri", REQUIRED, "Для внешнего слоя является обязательным");
        }
    }

    private void common(@NotNull Errors errors, LayerCreateDto dto) {
        if (dto.getTitle() == null) {
            errors.rejectValue("title", REQUIRED, DEFAULT_V_MESSAGE);
        }

        if (dto.getTableName() == null) {
            errors.rejectValue("tableName", REQUIRED, DEFAULT_V_MESSAGE);
        }

        if (dto.getStyleName() == null) {
            errors.rejectValue("styleName", REQUIRED, DEFAULT_V_MESSAGE);
        }
    }
}
