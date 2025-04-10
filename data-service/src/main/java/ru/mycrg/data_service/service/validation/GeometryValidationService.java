package ru.mycrg.data_service.service.validation;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.common_contracts.generated.data_service.GeometryValidationResultDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.geo_json.Feature;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeometryValidationService {

    private static final Map<String, String> TRANSLATIONS = new HashMap<>() {{
        put("Invalid Coordinate[inf inf]", "Координаты выходят за допустимые границы!!!");
        put("Invalid coordinate", "Координата содержит недопустимое значение (например, NaN): ");
        put("Too few points in geometry component", "Слишком мало точек для образования допустимой геометрии: ");
        put("Polygon orientation is incorrect", "Неверная ориентация кольца: ");
        put("Self-intersection", "Самопересечение: ");
        put("Ring Self-intersection", "Самопересечение в кольце полигона: ");
        put("Self-touching rings", "Кольца касаются себя (например, петля): ");
        put("Interior is disconnected", "Полигон разорван: ");
        put("Hole lies outside shell", "Внутреннее кольцо лежит вне внешнего кольца: ");
        put("Holes are nested", "Одна вырезка вложена в другую: ");
    }};

    private final SpatialRecordsDao spatialRecordsDao;

    public GeometryValidationService(SpatialRecordsDao spatialRecordsDao) {
        this.spatialRecordsDao = spatialRecordsDao;
    }

    private void validateResult(GeometryValidationResultDto result) {
        if (!result.isValid()) {
            throw new BadRequestException(
                    "Геометрия содержит ошибки: " +
                            translateMessage(result.getMessage()));
        }
    }

    public void validateGeometry(Feature feature, String srs) {
        if (feature == null || feature.getGeometry() == null) {
            ErrorInfo errorInfo = new ErrorInfo("geometry", "Геометрия не может быть пустой");

            throw new BadRequestException("Ошибка валидации геометрии", errorInfo);
        }

        try {
            String geometryJson = JsonConverter.getJsonString(feature.getGeometry());

            // Проверка корректности геометрии
            validateResult(spatialRecordsDao.validateGeometry(geometryJson));

            // Проверка попадания в границы земной поверхности
            String modSrc = srs.contains(":") ? srs.substring(srs.indexOf(':') + 1) : srs;
            validateResult(spatialRecordsDao.checkOnEarthSurface(geometryJson, modSrc));
        } catch (JsonProcessingException e) {
            ErrorInfo errorInfo = new ErrorInfo("geometry", "Ошибка сериализации геометрии: " + e.getMessage());

            throw new BadRequestException("Ошибка обработки геометрии", errorInfo);
        }
    }

    public static String translateMessage(String message) {
        for (Map.Entry<String, String> entry: TRANSLATIONS.entrySet()) {
            if (message.contains(entry.getKey())) {
                return message.replace(entry.getKey(), entry.getValue());
            }
        }

        return message;
    }
}
