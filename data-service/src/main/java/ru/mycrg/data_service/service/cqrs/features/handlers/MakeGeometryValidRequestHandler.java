package ru.mycrg.data_service.service.cqrs.features.handlers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.cqrs.features.requests.MakeGeometryValidRequest;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.geo_json.GeoJsonObject;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.mediator.IRequestHandler;

import static ru.mycrg.data_service.util.JsonConverter.getJsonString;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNodeFromString;

@Component
public class MakeGeometryValidRequestHandler implements IRequestHandler<MakeGeometryValidRequest, Feature> {

    private static final Map<String, Integer> SUPPORTED_GEOMETRY_TYPES = Map.of(
            "MultiPoint", 1,
            "Point", 1,
            "MultiLineString", 2,
            "LineString", 2,
            "MultiPolygon", 3,
            "Polygon", 3
    );

    private static final Set<String> SIMPLE_GEOMETRY_SET = Set.of(
            "Point",
            "LineString",
            "Polygon");

    private final SpatialRecordsDao spatialRecordsDao;

    public MakeGeometryValidRequestHandler(SpatialRecordsDao spatialRecordsDao) {
        this.spatialRecordsDao = spatialRecordsDao;
    }

    @Override
    public Feature handle(MakeGeometryValidRequest request) {
        Feature incomeFeature = request.getFeature();
        if (incomeFeature == null || incomeFeature.getGeometry() == null) {
            throw new BadRequestException("Feature или Geometry не могут быть пустыми");
        }

        try {
            JsonNode incomeGeometryNode = parseGeometryToNode(incomeFeature.getGeometry());
            validateCoordinates(incomeGeometryNode.get("coordinates"), "Coordinates не могут быть пустыми");

            String incomeGeometryJson = getJsonString(incomeFeature.getGeometry());
            String validGeometryJson = spatialRecordsDao.makeValidGeometry(incomeGeometryJson);

            Feature validFeature = new Feature();
            setGeometryToFeature(validGeometryJson, validFeature);

            String incomeGeometryType = incomeGeometryNode.get("type").asText();
            String validGeometryType = toJsonNodeFromString(validGeometryJson).get("type").asText();

            if (!incomeGeometryType.equalsIgnoreCase(validGeometryType)) {
                forceValidGeomToIncome(incomeGeometryType, validGeometryJson, validFeature);
            }

            return validFeature;
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Ошибка при обработке JSON геометрии: " + e.getMessage());
        } catch (CrgDaoException e) {
            throw new BadRequestException("Ошибка при приведении геометрии: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Невозможно исправить данную геометрию автоматически: " + e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Неожиданная ошибка: " + e.getMessage());
        }
    }

    private void forceValidGeomToIncome(String incomeGeometryType, String validGeometryJson, Feature validFeature)
            throws CrgDaoException, JsonProcessingException {
        Integer incomeGeometryCode = SUPPORTED_GEOMETRY_TYPES.get(incomeGeometryType);
        if (incomeGeometryCode == null) {
            throw new IllegalArgumentException("Неподдерживаемый тип геометрии: " + incomeGeometryType);
        }

        String formattedValidGeometry = spatialRecordsDao.makeGeometryOptionType(
                validGeometryJson,
                incomeGeometryCode,
                SIMPLE_GEOMETRY_SET.contains(incomeGeometryType)
        );
        if (formattedValidGeometry == null) {
            throw new IllegalArgumentException("Не получилось привести объект к геометрии слоя.");
        }

        setGeometryToFeature(formattedValidGeometry, validFeature);

        JsonNode validGeometryNode = parseGeometryToNode(validFeature.getGeometry());
        validateCoordinates(validGeometryNode.get("coordinates"),
                            "Не удалось привести геометрию к требуемому типу!");
    }

    private void validateCoordinates(JsonNode coordinatesNode, String message) {
        if (coordinatesNode == null || !coordinatesNode.isArray() || coordinatesNode.size() == 0) {
            throw new IllegalArgumentException(message);
        }
    }

    private JsonNode parseGeometryToNode(GeoJsonObject geometry) throws JsonProcessingException {
        return toJsonNodeFromString(getJsonString(geometry));
    }

    private void setGeometryToFeature(String geometryJson, Feature feature) {
        if (geometryJson != null) {
            JsonConverter.fromJson(geometryJson, GeoJsonObject.class)
                         .ifPresent(feature::setGeometry);
        }
    }
}
