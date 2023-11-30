package ru.mycrg.data_service.kpt_import.reader;

import org.postgis.MultiPolygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.CadastralNumberExtractor;
import ru.mycrg.data_service.kpt_import.GeometryParser;
import ru.mycrg.data_service.kpt_import.model.ZuElement;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLStreamReader;
import java.math.BigDecimal;
import java.util.*;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

@Component
public class ZuReader implements KptXmlElementReader<ZuElement> {

    private static final Logger log = LoggerFactory.getLogger(ZuReader.class);
    private final Unmarshaller unmarshaller;
    private final GeometryParser geometryParser;

    public ZuReader(GeometryParser geometryParser) throws JAXBException {
        JAXBContext jaxbContext = JAXBContext.newInstance(LandRecord.class);
        this.unmarshaller = jaxbContext.createUnmarshaller();
        this.geometryParser = geometryParser;
    }

    @Override
    public ZuElement read(XMLStreamReader reader) {
        LandRecord lr;
        try {
            lr = unmarshaller.unmarshal(reader, LandRecord.class).getValue();
        } catch (Exception ex) {
            log.warn("Ошибка чтения земельного участка: " + ex.getMessage());
            return new ZuElement(Collections.emptyMap());
        }
        Map<String, Object> content = new HashMap<>();
        String cadastralNumber = extractCadastralNumber(lr);
        List<ContourZUZacrep> contours = extractContours(lr);
        Optional<MultiPolygon> shape;
        try {
            shape = geometryParser.createMultiPolygon(contours);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга геометрии для элемента с кадастровым номером {}: {}", cadastralNumber,
                     ex.getMessage());
            shape = Optional.empty();
        }
        if (shape.isPresent()) {
            //парсим только объекты с геометрией
            content.put("cadastralnum", cadastralNumber);
            content.put("num_zu", CadastralNumberExtractor.extractNumberFromCadastralNum(cadastralNumber));
            content.put("usage", extractPermittedUsageByDocument(lr));
            content.put("subtype", extractSubtype(lr));
            content.put("category", extractCategory(lr));
            content.put("readableaddress", extractReadableAddress(lr));
            content.put("objecttype", extractObjectType(lr));
            content.put("cost", extractCost(lr));
            content.put(DEFAULT_GEOMETRY_COLUMN_NAME, shape.get());
            content.put("area_doc_2", extractAreaDoc(lr));
        }
        return new ZuElement(content);
    }

    @Override
    public String getXmlTag() {
        return ZuElement.XML_TAG;
    }

    private String extractCadastralNumber(LandRecord lr) {
        return lr.getObject().getCommonData().getCadNumber();
    }

    private String extractPermittedUsageByDocument(LandRecord lr) {
        return Optional.ofNullable(lr.getParams().getPermittedUse()).map(AllowedUse::getPermittedUseEstablished)
                       .map(PermittedUseEstablished::getByDocument).orElse(null);
    }

    private String extractSubtype(LandRecord lr) {
        return lr.getObject().getSubtype().getValue();
    }

    private String extractCategory(LandRecord lr) {
        return lr.getParams().getCategory().getType().getValue();
    }

    private String extractReadableAddress(LandRecord lr) {
        return Optional.ofNullable(lr.getAddressLocation()).map(AddressLocationLand::getAddress)
                       .map(AddressMain::getReadableAddress).orElse(null);
    }

    private String extractObjectType(LandRecord lr) {
        return lr.getObject().getCommonData().getType().getValue();
    }

    private BigDecimal extractCost(LandRecord lr) {
        return Optional.ofNullable(lr.getCost()).map(Cost::getValue).orElse(null);
    }

    private BigDecimal extractAreaDoc(LandRecord lr) {
        return lr.getParams().getArea().getValue();
    }

    private List<ContourZUZacrep> extractContours(LandRecord lr) {
        return Optional.ofNullable(lr.getContoursLocation()).map(ContoursLocationZUZacrep::getContours)
                       .map(ContoursZUZacrep::getContour).orElse(Collections.emptyList());
    }
}
