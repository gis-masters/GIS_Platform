package ru.mycrg.data_service.service.cqrs.features.handlers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.common_contracts.generated.data_service.GeometryValidationResultDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.cqrs.features.requests.CheckGeometryValidRequest;
import ru.mycrg.data_service.service.validation.GeometryValidationService;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequestHandler;

@Component
public class CheckGeometryValidRequestHandler implements IRequestHandler<CheckGeometryValidRequest, GeometryValidationResultDto> {

    private final SpatialRecordsDao spatialRecordsDao;
    private final ObjectMapper objectMapper;

    public CheckGeometryValidRequestHandler(SpatialRecordsDao spatialRecordsDao,
                                            ObjectMapper objectMapper) {
        this.spatialRecordsDao = spatialRecordsDao;
        this.objectMapper = objectMapper;
    }

    @Override
    public GeometryValidationResultDto handle(CheckGeometryValidRequest request) {
        Feature feature = request.getFeature();

        if (feature == null) {
            throw new BadRequestException("Feature не может быть пустой");
        }

        if (feature.getGeometry() == null) {
            throw new BadRequestException("Geometry не может быть пустой");
        }

        try {
            String geometryJson = objectMapper.writeValueAsString(feature.getGeometry());

            // Проверяем базовую валидность геометрии
            GeometryValidationResultDto validationResult = spatialRecordsDao.validateGeometry(geometryJson);
            if (!validationResult.isValid()) {
                return new GeometryValidationResultDto(
                        false,
                        GeometryValidationService.translateMessage(validationResult.getMessage())
                );
            }

            // Проверяем не вышли ли мы за пределы шара земли
            GeometryValidationResultDto geochemistryResult = spatialRecordsDao.
                    checkOnEarthSurface(geometryJson, request.getEpsg());

            return new GeometryValidationResultDto(
                    geochemistryResult.isValid(),
                    GeometryValidationService.translateMessage(geochemistryResult.getMessage())
            );
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Ошибка обработки геометрии: " + e.getMessage());
        }
    }
}
