package ru.mycrg.data_service.kpt_import.model.oks.parsers;

import org.postgis.MultiLineString;
import org.postgis.MultiPoint;
import org.postgis.MultiPolygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.kpt_import.KptImportUtils;
import ru.mycrg.data_service.kpt_import.geometry_parsers.OksGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.*;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.CADASTRALNUM;

public abstract class BaseOksElementParser {

    private static final Logger log = LoggerFactory.getLogger(BaseOksElementParser.class);

    private final OksGeometryParser geometryParser;

    protected BaseOksElementParser(OksGeometryParser geometryParser) {
        this.geometryParser = geometryParser;
    }

    protected void parseMultiPolygon(List<SpatialElementOKSOut> spatialElements, Map<String, Object> content) {
        Optional<MultiPolygon> shape;
        try {
            shape = geometryParser.createMultiPolygon(spatialElements);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга площадной геометрии для элемента с кадастровым номером {}: {}",
                     content.get(CADASTRALNUM), ex.getMessage());
            shape = Optional.empty();
        }

        if (shape.isEmpty()) {
            return;
        }

        content.put(DEFAULT_GEOMETRY_COLUMN_NAME, shape.get());
    }

    protected void parseMultilineString(List<SpatialElementOKSOut> spatialElements, Map<String, Object> content) {
        Optional<MultiLineString> shape;
        try {
            shape = geometryParser.createMultilineString(spatialElements);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга линейной геометрии для элемента с кадастровым номером {}: {}",
                     content.get(CADASTRALNUM), ex.getMessage());
            shape = Optional.empty();
        }

        if (shape.isEmpty()) {
            return;
        }

        content.put(DEFAULT_GEOMETRY_COLUMN_NAME, shape.get());
    }

    protected void parsePoint(List<SpatialElementOKSOut> spatialElements, Map<String, Object> content) {
        Optional<MultiPoint> shape;
        try {
            shape = geometryParser.createMultiPoint(spatialElements);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга точечной геометрии для элемента с кадастровым номером {}: {}",
                     content.get(CADASTRALNUM), ex.getMessage());
            shape = Optional.empty();
        }

        if (shape.isEmpty()) {
            return;
        }

        content.put(DEFAULT_GEOMETRY_COLUMN_NAME, shape.get());
    }

    protected List<ContourOKSOut> extractContours(ContoursOKSOut contours) {
        return Optional.ofNullable(contours.getContour()).orElse(Collections.emptyList());
    }

    List<SpatialElementOKSOut> extractSpatialElements(List<ContourOKSOut> contours) {
        return contours.stream()
                       .map(ContourOKSOut::getEntitySpatial)
                       .map(EntitySpatialOKSOut::getSpatialsElements)
                       .map(SpatialsElementsOKSOut::getSpatialElement)
                       .flatMap(Collection::stream)
                       .collect(Collectors.toList());
    }

    protected List<OrdinateOKSOut> extractOrdinates(SpatialElementOKSOut spatialElement) {
        return Optional.ofNullable(spatialElement.getOrdinates())
                       .map(OrdinatesOKSOut::getOrdinate)
                       .orElse(Collections.emptyList());
    }

    protected boolean isOrdinatesPolygon(List<OrdinateOKSOut> ordinates) {
        if (ordinates.size() < 3) {
            return false;
        }

        OrdinateOKSOut first = ordinates.get(0);
        OrdinateOKSOut last = ordinates.get(ordinates.size() - 1);

        return hasSameNum(first, last) || hasSameOrdinates(first, last);
    }

    protected boolean isOrdinatesPolyline(List<OrdinateOKSOut> ordinates) {
        if (ordinates.size() < 2) {
            return false;
        }

        OrdinateOKSOut first = ordinates.get(0);
        OrdinateOKSOut last = ordinates.get(ordinates.size() - 1);

        return hasDifferentNum(first, last) || hasDifferentOrdinates(first, last);
    }

    protected boolean isSpatialElementPolygon(SpatialElementOKSOut spatialElement) {
        return isOrdinatesPolygon(extractOrdinates(spatialElement));
    }

    protected boolean isSpatialElementPolyline(SpatialElementOKSOut spatialElement) {
        return isOrdinatesPolyline(extractOrdinates(spatialElement));
    }

    protected boolean isSpatialElementPoint(SpatialElementOKSOut spatialElement) {
        return isOrdinatesPoint(extractOrdinates(spatialElement));
    }

    protected boolean isOrdinatesPoint(List<OrdinateOKSOut> ordinates) {
        return ordinates.size() == 1
                && ordinates.get(0).getX() != null && ordinates.get(0).getY() != null;
    }

    protected Map<String, Object> buildPolygonContent(Object xmlRecord) {
        ObjectType objectType = extractObjectType(xmlRecord);
        String cadastralnumber = extractCadastralNumber(objectType);

        Map<String, Object> content = new HashMap<>();
        content.put(CADASTRALNUM, cadastralnumber);
        content.put("num_oks", KptImportUtils.extractNumberFromCadastralNum(cadastralnumber));
        content.put("objecttype", extractObjectType(objectType));
        content.put("readablead", extractReadableAddress(xmlRecord));
        content.put("purpose", extractPurpose(xmlRecord));
        content.put("cost", extractCostValue(xmlRecord));
        content.put("area_doc_2", extractAreaDoc(xmlRecord));

        return content;
    }

    protected Map<String, Object> buildPolylineContent(Object xmlRecord) {
        ObjectType objectType = extractObjectType(xmlRecord);
        String cadastralnumber = extractCadastralNumber(objectType);

        Map<String, Object> content = new HashMap<>();
        content.put(CADASTRALNUM, cadastralnumber);
        content.put("num_oks", KptImportUtils.extractNumberFromCadastralNum(cadastralnumber));
        content.put("objecttype", extractObjectType(objectType));
        content.put("readablead", extractReadableAddress(xmlRecord));
        content.put("purpose", extractPurpose(xmlRecord));
        content.put("cost", extractCostValue(xmlRecord));
        content.put("lenght_doc", extractLengthDoc(xmlRecord));

        return content;
    }

    protected Map<String, Object> buildPointContent(Object xmlRecord) {
        ObjectType objectType = extractObjectType(xmlRecord);
        String cadastralnumber = extractCadastralNumber(objectType);

        Map<String, Object> content = new HashMap<>();
        content.put(CADASTRALNUM, cadastralnumber);
        content.put("num_oks", KptImportUtils.extractNumberFromCadastralNum(cadastralnumber));
        content.put("purpose", extractPurpose(xmlRecord));
        content.put("objecttype", extractObjectType(objectType));
        content.put("usage", extractUsage(xmlRecord));
        content.put("raddress", extractReadableAddress(xmlRecord));
        content.put("cost", extractCostValue(xmlRecord));

        return content;
    }

    protected String extractCadastralNumber(ObjectType objectType) {
        return objectType == null
                ? null
                : Optional.ofNullable(objectType.getCommonData())
                          .map(CommonDataType::getCadNumber)
                          .orElse(null);
    }

    protected String extractObjectType(ObjectType objectType) {
        return objectType == null
                ? null
                : Optional.ofNullable(objectType.getCommonData())
                          .map(CommonDataType::getType)
                          .map(Dict::getValue)
                          .orElse(null);
    }

    protected BigDecimal extractCostValue(Object xmlRecord) {
        Cost cost = extractCost(xmlRecord);
        return cost == null ? null : cost.getValue();
    }

    protected List<List<SpatialElementOKSOut>> splitSpatialElementsByGeometryType(List<SpatialElementOKSOut> spEls) {
        List<SpatialElementOKSOut> polygonSpatialElements = new LinkedList<>();
        List<SpatialElementOKSOut> polylineSpatialElements = new LinkedList<>();
        List<SpatialElementOKSOut> pointSpatialElements = new LinkedList<>();

        for (SpatialElementOKSOut spatialElement: spEls) {
            if (isSpatialElementPolygon(spatialElement)) {
                polygonSpatialElements.add(spatialElement);
            } else if (isSpatialElementPolyline(spatialElement)) {
                polylineSpatialElements.add(spatialElement);
            } else if (isSpatialElementPoint(spatialElement)) {
                pointSpatialElements.add(spatialElement);
            }
        }

        return Arrays.asList(polygonSpatialElements, polylineSpatialElements, pointSpatialElements);
    }

    protected abstract String extractReadableAddress(Object xmlRecord);

    protected abstract String extractPurpose(Object xmlRecord);

    protected abstract BigDecimal extractAreaDoc(Object xmlRecord);

    protected abstract BigDecimal extractLengthDoc(Object xmlRecord);

    protected abstract ObjectType extractObjectType(Object xmlRecord);

    protected abstract Cost extractCost(Object xmlRecord);

    protected abstract String extractUsage(Object xmlRecord);
}
