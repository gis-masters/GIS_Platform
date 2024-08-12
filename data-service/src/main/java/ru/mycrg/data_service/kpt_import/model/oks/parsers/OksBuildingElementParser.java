package ru.mycrg.data_service.kpt_import.model.oks.parsers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry_parsers.OksGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingPolygonElement;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.kpt_import.reader.AddressExtractor.getAddress;

@Component
public class OksBuildingElementParser extends BaseOksElementParser {

    public OksBuildingElementParser(OksGeometryParser geometryParser) {
        super(geometryParser);
    }

    public OksBuildingElement parseByGeometry(BuildRecord xmlRecord) {
        if (xmlRecord.getContours() == null) {
            return new OksBuildingElement(Collections.emptyMap());
        }

        List<SpatialElementOKSOut> spatialElements = extractSpatialElements(extractContours(xmlRecord.getContours()));

        if (!spatialElements.isEmpty()) {
            Map<String, Object> content = buildPolygonContent(xmlRecord);
            parseMultiPolygon(spatialElements, content);

            return new OksBuildingPolygonElement(content);
        }

        return new OksBuildingElement(Collections.emptyMap());
    }

    @Override
    protected String extractReadableAddress(Object xmlRecord) {
        BuildRecord buildRecord = (BuildRecord) xmlRecord;

        return Optional.ofNullable(buildRecord.getAddressLocation())
                       .flatMap(alBuild -> getAddress(alBuild.getAddress()))
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
    protected BigDecimal extractLengthDoc(Object xmlRecord) {
        return null;
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
