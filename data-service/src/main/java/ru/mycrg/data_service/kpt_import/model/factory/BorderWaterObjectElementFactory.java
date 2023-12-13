package ru.mycrg.data_service.kpt_import.model.factory;

import org.postgis.MultiLineString;
import org.postgis.MultiPolygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry.BoundGeometryParser;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectElement;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectPolygonElement;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectPolylineElement;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import javax.xml.datatype.XMLGregorianCalendar;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.hasSameNum;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.hasSameOrdinates;

@Component
public class BorderWaterObjectElementFactory {

    private static final Logger log = LoggerFactory.getLogger(BorderWaterObjectElementFactory.class);

    private final BoundGeometryParser geometryParser;

    public BorderWaterObjectElementFactory(BoundGeometryParser geometryParser) {
        this.geometryParser = geometryParser;
    }

    public BorderWaterObjectElement fromCoastlineRecord(CoastlineBoundariesType.CoastlineRecord xmlRecord) {
        if (xmlRecord.getBContoursLocation() == null) {
            return new BorderWaterObjectElement(Collections.emptyMap());
        }

        List<BoundContourOut> contours = extractContours(xmlRecord);

        Map<String, Object> content;
        List<BoundContourOut> polygonContours = filterPolygonContours(contours);
        if (!polygonContours.isEmpty()) {
            content = buildContent(xmlRecord);
            parseMultiPolygon(polygonContours, content);
            return new BorderWaterObjectPolygonElement(content);
        }

        List<BoundContourOut> polylineContours = filterPolylineContours(contours);
        if (!polylineContours.isEmpty()) {
            content = buildContent(xmlRecord);
            parseMultiLineString(polylineContours, content);
            return new BorderWaterObjectPolylineElement(content);
        }

        return new BorderWaterObjectElement(Collections.emptyMap());
    }

    private void parseMultiPolygon(List<BoundContourOut> polygonContours, Map<String, Object> content) {
        Optional<MultiPolygon> shape;
        try {
            shape = geometryParser.createMultiPolygon(polygonContours);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга площадной геометрии для береговой линии с номером {}: {}",
                     content.get("regnumborder"), ex.getMessage());
            shape = Optional.empty();
        }

        shape.ifPresent(multiLineString -> content.put(DEFAULT_GEOMETRY_COLUMN_NAME, multiLineString));
    }

    private void parseMultiLineString(List<BoundContourOut> polylineContours, Map<String, Object> content) {
        Optional<MultiLineString> shape;
        try {
            shape = geometryParser.createMultiLineString(polylineContours);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга линейной геометрии для береговой линии с номером {}: {}",
                     content.get("regnumborder"), ex.getMessage());
            shape = Optional.empty();
        }

        shape.ifPresent(multiLineString -> content.put(DEFAULT_GEOMETRY_COLUMN_NAME, multiLineString));
    }

    private List<BoundContourOut> filterPolygonContours(List<BoundContourOut> contours) {
        return contours.stream()
                       .filter(this::isPolygonContour)
                       .collect(Collectors.toList());
    }

    private List<BoundContourOut> filterPolylineContours(List<BoundContourOut> contours) {
        return contours.stream()
                       .filter(this::isPolylineContour)
                       .collect(Collectors.toList());
    }

    private List<BoundContourOut> extractContours(CoastlineBoundariesType.CoastlineRecord xmlRecord) {
        return Optional.ofNullable(xmlRecord.getBContoursLocation())
                       .map(BoundContoursLocationOut::getContours)
                       .map(BoundContoursOut::getContour)
                       .orElse(Collections.emptyList());
    }

    private Optional<Bobject> extractBObject(CoastlineBoundariesType.CoastlineRecord xmlRecord) {
        return Optional.ofNullable(xmlRecord.getBObjectZonesAndTerritories())
                       .map(BobjectZonesAndTerritories::getBObject);
    }

    private Optional<Water> extractWater(CoastlineBoundariesType.CoastlineRecord xmlRecord) {
        return Optional.ofNullable(xmlRecord.getBObjectZonesAndTerritories())
                       .map(BobjectZonesAndTerritories::getWater);
    }

    private String extractRegistrationDate(CoastlineBoundariesType.CoastlineRecord xmlRecord) {
        return Optional.ofNullable(xmlRecord.getRecordInfo())
                       .map(RecordInfoDate::getRegistrationDate)
                       .map(XMLGregorianCalendar::toString)
                       .orElse(null);
    }

    private boolean isSpatialElementPolygon(SpatialElementBound spatialElement) {
        return isOrdinatesPolygon(geometryParser.extractOrdinates(spatialElement));
    }

    private boolean isOrdinatesPolygon(List<OrdinateBound> ordinates) {
        if (ordinates == null || ordinates.size() < 3) {
            return false;
        }

        OrdinateBound first = ordinates.get(0);
        OrdinateBound last = ordinates.get(ordinates.size() - 1);

        return hasSameNum(first, last) || hasSameOrdinates(first, last);
    }

    /**
     * Если первый spatialElement полигон, то контур считается полигоном
     */
    private boolean isPolygonContour(BoundContourOut contour) {
        if (contour == null) {
            return false;
        }

        List<SpatialElementBound> spatialElements = geometryParser.extractSpatialElements(contour);
        if (spatialElements.isEmpty()) {
            return false;
        }

        SpatialElementBound first = spatialElements.get(0);
        return isSpatialElementPolygon(first);
    }

    /**
     * Если хотябы один spatialElement линейный, то контур считается линейным
     */
    private boolean isPolylineContour(BoundContourOut contour) {
        if (contour == null) {
            return false;
        }

        List<SpatialElementBound> spatialElements = geometryParser.extractSpatialElements(contour);
        if (spatialElements.isEmpty()) {
            return false;
        }

        return spatialElements.stream().anyMatch(geometryParser::isSpatialElementPolyline);
    }

    protected Map<String, Object> buildContent(CoastlineBoundariesType.CoastlineRecord xmlRecord) {
        Optional<Bobject> bobject = extractBObject(xmlRecord);
        Optional<Water> water = extractWater(xmlRecord);

        Map<String, Object> content = new HashMap<>();
        content.put("regnumborder", bobject.map(Bobject::getRegNumbBorder).orElse(null));
        content.put("btypecode", bobject.map(Bobject::getTypeBoundary).map(Dict::getCode).orElse(null));
        content.put("btype", bobject.map(Bobject::getTypeBoundary).map(Dict::getValue).orElse(null));
        content.put("objectname", water.map(Water::getWaterObjectName).orElse(null));
        content.put("wocode", water.map(Water::getWaterObjectType).map(Dict::getCode).orElse(null));
        content.put("wotype", water.map(Water::getWaterObjectType).map(Dict::getValue).orElse(null));
        content.put("rdate", extractRegistrationDate(xmlRecord));

        return content;
    }
}
