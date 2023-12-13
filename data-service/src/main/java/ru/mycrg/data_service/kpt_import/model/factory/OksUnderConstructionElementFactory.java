package ru.mycrg.data_service.kpt_import.model.factory;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry.OksGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPointElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPolygonElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPolylineElement;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class OksUnderConstructionElementFactory extends OksElementFactory {

    protected OksUnderConstructionElementFactory(OksGeometryParser geometryParser) {
        super(geometryParser);
    }

    public OksUnderConstructionElement fromObjectUnderConstructionRecord(ObjectUnderConstructionRecord xmlRecord) {
        if (xmlRecord.getContours() == null) {
            return new OksUnderConstructionElement(Collections.emptyMap());
        }

        List<SpatialElementOKSOut> spatialElements = extractSpatialElements(extractContours(xmlRecord.getContours()));

        Map<String, Object> content;
        List<SpatialElementOKSOut> polygonSpatialElements = filterSpatialElementsPolygon(spatialElements);
        if (!polygonSpatialElements.isEmpty()) {
            content = buildPolygonContent(xmlRecord);
            parseMultiPolygon(polygonSpatialElements, content);
            return new OksUnderConstructionPolygonElement(content);
        }

        List<SpatialElementOKSOut> polylineSpatialElements = filterSpatialElementsPolyline(spatialElements);
        if (!polylineSpatialElements.isEmpty()) {
            content = buildPolylineContent(xmlRecord);
            parseMultilineString(polylineSpatialElements, content);
            return new OksUnderConstructionPolylineElement(content);
        }

        List<SpatialElementOKSOut> pointSpatialElements = filterSpatialElementsPoint(spatialElements);
        if (!pointSpatialElements.isEmpty()) {
            content = buildPointContent(xmlRecord);
            parsePoint(pointSpatialElements, content);
            return new OksUnderConstructionPointElement(content);
        }

        return new OksUnderConstructionElement(Collections.emptyMap());
    }

    @Override
    protected String extractReadableAddress(Object xmlRecord) {
        ObjectUnderConstructionRecord oucr = (ObjectUnderConstructionRecord) xmlRecord;
        return Optional.ofNullable(oucr.getAddressLocation())
                       .map(AddressLocationConstruction::getAddress)
                       .map(AddressMain::getReadableAddress)
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
        return Optional.ofNullable(oucr.getParams())
                       .map(ParamsConstructionPurpose::getBaseParameters)
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
