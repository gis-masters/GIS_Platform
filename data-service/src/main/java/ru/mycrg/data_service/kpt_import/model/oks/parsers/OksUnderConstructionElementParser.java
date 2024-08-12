package ru.mycrg.data_service.kpt_import.model.oks.parsers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry_parsers.OksGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPointElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPolygonElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPolylineElement;

import java.math.BigDecimal;
import java.util.*;

import static ru.mycrg.data_service.kpt_import.reader.AddressExtractor.getAddress;

@Component
public class OksUnderConstructionElementParser extends BaseOksElementParser {

    protected OksUnderConstructionElementParser(OksGeometryParser geometryParser) {
        super(geometryParser);
    }

    public List<OksUnderConstructionElement> parseByGeometry(ObjectUnderConstructionRecord xmlRecord) {
        if (xmlRecord.getContours() == null) {
            return Collections.emptyList();
        }

        List<SpatialElementOKSOut> spatialElements = extractSpatialElements(extractContours(xmlRecord.getContours()));
        List<List<SpatialElementOKSOut>> spElsByType = splitSpatialElementsByGeometryType(spatialElements);
        List<SpatialElementOKSOut> polygonSpatialElements = spElsByType.get(0);
        List<SpatialElementOKSOut> polylineSpatialElements = spElsByType.get(1);
        List<SpatialElementOKSOut> pointSpatialElements = spElsByType.get(2);

        List<OksUnderConstructionElement> result = new LinkedList<>();
        if (!polygonSpatialElements.isEmpty()) {
            Map<String, Object> content = buildPolygonContent(xmlRecord);
            parseMultiPolygon(polygonSpatialElements, content);

            result.add(new OksUnderConstructionPolygonElement(content));
        }

        if (!polylineSpatialElements.isEmpty()) {
            Map<String, Object> content = buildPolylineContent(xmlRecord);
            parseMultilineString(polylineSpatialElements, content);

            result.add(new OksUnderConstructionPolylineElement(content));
        }

        if (!pointSpatialElements.isEmpty()) {
            Map<String, Object> content = buildPointContent(xmlRecord);
            parsePoint(pointSpatialElements, content);

            result.add(new OksUnderConstructionPointElement(content));
        }

        return result;
    }

    @Override
    protected String extractReadableAddress(Object xmlRecord) {
        ObjectUnderConstructionRecord oucr = (ObjectUnderConstructionRecord) xmlRecord;

        return Optional.ofNullable(oucr.getAddressLocation())
                       .flatMap(alUnderConstruction -> getAddress(alUnderConstruction.getAddress()))
                       .orElse(null);
    }

    @Override
    protected String extractPurpose(Object xmlRecord) {
        ObjectUnderConstructionRecord oucr = (ObjectUnderConstructionRecord) xmlRecord;

        return Optional.ofNullable(oucr.getParams())
                       .map(ParamsConstructionPurpose::getPurpose)
                       .orElse(null);
    }

    @Override
    protected BigDecimal extractAreaDoc(Object xmlRecord) {
        ObjectUnderConstructionRecord oucr = (ObjectUnderConstructionRecord) xmlRecord;

        List<BaseParameters.BaseParameter> baseParameters = Optional
                .ofNullable(oucr.getParams())
                .map(ParamsConstructionPurpose::getBaseParameters)
                .map(BaseParameters::getBaseParameter)
                .orElse(new ArrayList<>());

        Optional<BigDecimal> oArea = baseParameters.stream()
                                                   .filter(baseParameter -> baseParameter.getArea() != null)
                                                   .findFirst()
                                                   .map(BaseParameters.BaseParameter::getArea);

        return oArea.orElseGet(() -> baseParameters.stream()
                                                   .filter(baseParameter -> baseParameter.getBuiltUpArea() != null)
                                                   .findFirst()
                                                   .map(BaseParameters.BaseParameter::getBuiltUpArea)
                                                   .orElse(null));
    }

    @Override
    protected BigDecimal extractLengthDoc(Object xmlRecord) {
        return null;
    }

    @Override
    protected ObjectType extractObjectType(Object xmlRecord) {
        ObjectUnderConstructionRecord oucr = (ObjectUnderConstructionRecord) xmlRecord;

        return oucr.getObject();
    }

    @Override
    protected Cost extractCost(Object xmlRecord) {
        ObjectUnderConstructionRecord oucr = (ObjectUnderConstructionRecord) xmlRecord;

        return oucr.getCost();
    }

    @Override
    protected String extractUsage(Object xmlRecord) {
        return null;
    }
}
