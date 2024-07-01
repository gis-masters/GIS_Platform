package ru.mycrg.data_service.kpt_import.model.factory;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry_parsers.OksGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPointElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPolygonElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPolylineElement;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class OksConstructionElementFactory extends OksElementFactory {

    public OksConstructionElementFactory(OksGeometryParser geometryParser) {
        super(geometryParser);
    }

    public List<OksConstructionElement> fromConstructionRecord(ConstructionRecord xmlRecord) {
        if (xmlRecord.getContours() == null) {
            return Collections.emptyList();
        }

        List<SpatialElementOKSOut> spatialElements = extractSpatialElements(extractContours(xmlRecord.getContours()));
        List<List<SpatialElementOKSOut>> spElsByType = splitSpatialElementsByGeometryType(spatialElements);
        List<SpatialElementOKSOut> polygonSpatialElements = spElsByType.get(0);
        List<SpatialElementOKSOut> polylineSpatialElements = spElsByType.get(1);
        List<SpatialElementOKSOut> pointSpatialElements = spElsByType.get(2);

        List<OksConstructionElement> result = new LinkedList<>();
        if (!polygonSpatialElements.isEmpty()) {
            Map<String, Object> content = buildPolygonContent(xmlRecord);
            parseMultiPolygon(polygonSpatialElements, content);
            result.add(new OksConstructionPolygonElement(content));
        }

        if (!polylineSpatialElements.isEmpty()) {
            Map<String, Object> content = buildPolylineContent(xmlRecord);
            parseMultilineString(polylineSpatialElements, content);
            result.add(new OksConstructionPolylineElement(content));
        }

        if (!pointSpatialElements.isEmpty()) {
            Map<String, Object> content = buildPointContent(xmlRecord);
            parsePoint(pointSpatialElements, content);
            result.add(new OksConstructionPointElement(content));
        }

        return result;
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
