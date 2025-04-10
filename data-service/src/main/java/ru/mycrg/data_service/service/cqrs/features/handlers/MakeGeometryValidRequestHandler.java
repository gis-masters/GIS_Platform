package ru.mycrg.data_service.service.cqrs.features.handlers;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.cqrs.features.requests.MakeGeometryValidRequest;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.geo_json.GeoJsonObject;
import ru.mycrg.mediator.IRequestHandler;

@Component
public class MakeGeometryValidRequestHandler implements IRequestHandler<MakeGeometryValidRequest, Feature> {

    private final SpatialRecordsDao spatialRecordsDao;

    public MakeGeometryValidRequestHandler(SpatialRecordsDao spatialRecordsDao) {
        this.spatialRecordsDao = spatialRecordsDao;
    }

    @Override
    public Feature handle(MakeGeometryValidRequest request) {
        Feature feature = request.getFeature();

        if (feature == null) {
            throw new BadRequestException("Feature не может быть пустой");
        }

        if (feature.getGeometry() == null) {
            throw new BadRequestException("Geometry не может быть пустой");
        }

        try {
            String geometryJson = JsonConverter.getJsonString(feature.getGeometry());
            String validGeometryJson = spatialRecordsDao.makeValidGeometry(geometryJson);

            if (validGeometryJson != null) {
                JsonConverter.fromJson(validGeometryJson, GeoJsonObject.class)
                             .ifPresent(feature::setGeometry);
            }

            return feature;
        } catch (JsonProcessingException e) {
            ErrorInfo errorInfo = new ErrorInfo("geometry", "Ошибка при обработке JSON геометрии: " + e.getMessage());
            throw new BadRequestException("Ошибка обработки json", errorInfo);
        } catch (Exception e) {
            ErrorInfo errorInfo = new ErrorInfo("geometry", "Неожиданная ошибка: " + e.getMessage());
            throw new BadRequestException("Ошибка: ", errorInfo);
        }
    }
}
