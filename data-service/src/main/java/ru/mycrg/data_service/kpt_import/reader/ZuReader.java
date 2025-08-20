package ru.mycrg.data_service.kpt_import.reader;

import org.postgis.MultiPolygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.KptImportUtils;
import ru.mycrg.data_service.kpt_import.geometry_parsers.ZuGeometryParser;
import ru.mycrg.data_service.kpt_import.model.ZuElement;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.math.BigDecimal;
import java.util.*;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.kpt_import.reader.AddressExtractor.getAddress;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.CADASTRALNUM;

@Component
public class ZuReader extends CommonKptXmlElementReader<ZuElement, LandRecord> {

    private static final Logger log = LoggerFactory.getLogger(ZuReader.class);

    private final ZuGeometryParser geometryParser;

    public ZuReader(ZuGeometryParser geometryParser) throws JAXBException {
        super(LandRecord.class, ZuElement.XML_TAG);

        this.geometryParser = geometryParser;
    }

    @Override
    public List<ZuElement> read(XMLStreamReader reader) {
        LandRecord land;
        try {
            land = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения земельного участка!", ex);

            return Collections.emptyList();
        }

        String cadastralNumber = land.getObject().getCommonData().getCadNumber();
        Optional<MultiPolygon> oMultiPolygon;
        try {
            oMultiPolygon = geometryParser.createMultiPolygon(extractContours(land));
            if (oMultiPolygon.isEmpty()) {
                return Collections.emptyList();
            }
        } catch (Exception ex) {
            log.warn("Ошибка парсинга геометрии для элемента с кадастровым номером {}: {}",
                     cadastralNumber, ex.getMessage());

            return Collections.emptyList();
        }

        Map<String, Object> content = new HashMap<>();
        //парсим только объекты с геометрией
        content.put(CADASTRALNUM, cadastralNumber);
        content.put("num_zu", KptImportUtils.extractNumberFromCadastralNum(cadastralNumber));
        content.put("usage", extractPermittedUsageByDocument(land));
        content.put("subtype", extractSubtype(land));
        content.put("category", extractCategory(land));
        content.put("readableaddress", extractReadableAddress(land));
        content.put("objecttype", extractObjectType(land));
        content.put("cost", extractCost(land));
        content.put(DEFAULT_GEOMETRY_COLUMN_NAME, oMultiPolygon.get());
        content.put("area_doc_2", extractAreaDoc(land));

        return Collections.singletonList(new ZuElement(content));
    }

    private String extractPermittedUsageByDocument(LandRecord lr) {
        return Optional.ofNullable(lr.getParams().getPermittedUse())
                       .map(AllowedUse::getPermittedUseEstablished)
                       .map(PermittedUseEstablished::getByDocument).orElse(null);
    }

    private String extractSubtype(LandRecord lr) {
        return lr.getObject().getSubtype().getValue();
    }

    private String extractCategory(LandRecord lr) {
        return lr.getParams().getCategory().getType().getValue();
    }

    private String extractReadableAddress(LandRecord lr) {
        AddressLocationLand addressLocation = lr.getAddressLocation();
        if (addressLocation == null) {
            return null;
        }

        return getAddress(addressLocation.getAddress()).orElse(null);
    }

    private String extractObjectType(LandRecord lr) {
        return lr.getObject().getCommonData().getType().getValue();
    }

    private BigDecimal extractCost(LandRecord lr) {
        return Optional.ofNullable(lr.getCost())
                       .map(Cost::getValue)
                       .orElse(null);
    }

    private BigDecimal extractAreaDoc(LandRecord lr) {
        return lr.getParams().getArea().getValue();
    }

    private List<ContourZUZacrep> extractContours(LandRecord lr) {
        return Optional.ofNullable(lr.getContoursLocation())
                       .map(ContoursLocationZUZacrep::getContours)
                       .map(ContoursZUZacrep::getContour)
                       .orElse(Collections.emptyList());
    }
}
