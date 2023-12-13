package ru.mycrg.data_service.kpt_import.model.factory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry.OksGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingPolygonElement;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class OksBuildingElementFactory extends OksElementFactory {

    private static final Logger log = LoggerFactory.getLogger(OksBuildingElementFactory.class);

    public OksBuildingElementFactory(OksGeometryParser geometryParser) {
        super(geometryParser);
    }

    public OksBuildingElement fromBuildRecord(BuildRecord xmlRecord) {
        if (xmlRecord.getContours() == null) {
            return new OksBuildingElement(Collections.emptyMap());
        }

        List<SpatialElementOKSOut> spatialElements = extractSpatialElements(extractContours(xmlRecord.getContours()));

        Map<String, Object> content;
        List<SpatialElementOKSOut> polygonSpatialElements = filterSpatialElementsPolygon(spatialElements);
        if (!polygonSpatialElements.isEmpty()) {
            content = buildPolygonContent(xmlRecord);
            parseMultiPolygon(polygonSpatialElements, content);
            return new OksBuildingPolygonElement(content);
        }

        return new OksBuildingElement(Collections.emptyMap());
    }

    @Override
    protected String extractReadableAddress(Object xmlRecord) {
        BuildRecord buildRecord = (BuildRecord) xmlRecord;
        return Optional.ofNullable(buildRecord.getAddressLocation())
                       .map(AddressLocationBuild::getAddress)
                       .map(AddressMain::getReadableAddress)
                       .orElse(null);
    }

    @Override
    protected String extractPurpose(Object xmlRecord) {
        BuildRecord buildRecord = (BuildRecord) xmlRecord;
        return Optional.ofNullable(buildRecord.getParams())
                       .map(ParamsBuildPurposeUses::getPurpose)
                       .map(Dict::getValue)
                       .orElse(null);
    }

    @Override
    protected BigDecimal extractAreaDoc(Object xmlRecord) {
        BuildRecord buildRecord = (BuildRecord) xmlRecord;
        return Optional.ofNullable(buildRecord.getParams())
                       .map(ParamsBuildPurposeUses::getArea)
                       .orElse(null);
    }

    @Override
    protected ObjectType extractObjectType(Object xmlRecord) {
        BuildRecord buildRecord = (BuildRecord) xmlRecord;
        return buildRecord.getObject();
    }

    @Override
    protected Cost extractCost(Object xmlRecord) {
        BuildRecord buildRecord = (BuildRecord) xmlRecord;
        return buildRecord.getCost();
    }

    @Override
    protected String extractUsage(Object xmlRecord) {
        return null;
    }
}
