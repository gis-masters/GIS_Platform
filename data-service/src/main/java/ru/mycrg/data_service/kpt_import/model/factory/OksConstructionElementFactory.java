package ru.mycrg.data_service.kpt_import.model.factory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry.OksGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPointElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPolygonElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPolylineElement;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class OksConstructionElementFactory extends OksElementFactory {

    private static final Logger log = LoggerFactory.getLogger(OksConstructionElementFactory.class);

    public OksConstructionElementFactory(OksGeometryParser geometryParser) {
        super(geometryParser);
    }

    public OksConstructionElement fromConstructionRecord(ConstructionRecord xmlRecord) {
        if (xmlRecord.getContours() == null) {
            return new OksConstructionElement(Collections.emptyMap());
        }

        List<SpatialElementOKSOut> spatialElements = extractSpatialElements(extractContours(xmlRecord.getContours()));

        Map<String, Object> content;
        List<SpatialElementOKSOut> polygonSpatialElements = filterSpatialElementsPolygon(spatialElements);
        if (!polygonSpatialElements.isEmpty()) {
            content = buildPolygonContent(xmlRecord);
            parseMultiPolygon(polygonSpatialElements, content);
            return new OksConstructionPolygonElement(content);
        }

        List<SpatialElementOKSOut> polylineSpatialElements = filterSpatialElementsPolyline(spatialElements);
        if (!polylineSpatialElements.isEmpty()) {
            content = buildPolylineContent(xmlRecord);
            parseMultilineString(polylineSpatialElements, content);
            return new OksConstructionPolylineElement(content);
        }

        List<SpatialElementOKSOut> pointSpatialElements = filterSpatialElementsPoint(spatialElements);
        if (!pointSpatialElements.isEmpty()) {
            content = buildPointContent(xmlRecord);
            parsePoint(pointSpatialElements, content);
            return new OksConstructionPointElement(content);
        }

        return new OksConstructionElement(Collections.emptyMap());
    }

    @Override
    protected String extractReadableAddress(Object xmlRecord) {
        ConstructionRecord constructionRecord = (ConstructionRecord) xmlRecord;
        return Optional.ofNullable(constructionRecord.getAddressLocation())
                       .map(AddressLocationConstruction::getAddress)
                       .map(AddressMain::getReadableAddress)
                       .orElse(null);
    }

    @Override
    protected String extractPurpose(Object xmlRecord) {
        ConstructionRecord constructionRecord = (ConstructionRecord) xmlRecord;
        return Optional.ofNullable(constructionRecord.getParams())
                       .map(ParamsConstructionPurposeUses::getPurpose)
                       .orElse(null);
    }

    @Override
    protected BigDecimal extractAreaDoc(Object xmlRecord) {
        ConstructionRecord constructionRecord = (ConstructionRecord) xmlRecord;
        return Optional.ofNullable(constructionRecord.getParams())
                       .map(ParamsConstructionPurposeUses::getBaseParameters)
                       .map(BaseParameters::getBaseParameter)
                       .orElse(Collections.emptyList())
                       .stream()
                       .filter(baseParameter -> baseParameter.getArea() != null)
                       .findFirst()
                       .map(BaseParameters.BaseParameter::getArea)
                       .orElse(null);
    }

    @Override
    protected ObjectType extractObjectType(Object xmlRecord) {
        ConstructionRecord constructionRecord = (ConstructionRecord) xmlRecord;
        return constructionRecord.getObject();
    }

    @Override
    protected Cost extractCost(Object xmlRecord) {
        ConstructionRecord constructionRecord = (ConstructionRecord) xmlRecord;
        return constructionRecord.getCost();
    }

    @Override
    protected String extractUsage(Object xmlRecord) {
        ConstructionRecord constructionRecord = (ConstructionRecord) xmlRecord;
        return Optional.ofNullable(constructionRecord.getParams())
                       .map(ParamsConstructionPurposeUses::getPermittedUses)
                       .map(PermittedUses::getPermittedUse)
                       .orElse(Collections.emptyList())
                       .stream()
                       .map(PermittedUse::getName)
                       .collect(Collectors.joining("; "));
    }
}
