package ru.mycrg.data_service.service.parsers;

import org.postgis.LinearRing;
import org.postgis.MultiPolygon;
import org.postgis.Point;
import org.postgis.Polygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import ru.mycrg.data_service.service.parsers.exceptions.XmlParserException;
import ru.mycrg.data_service.util.SchemaHandler;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static ru.mycrg.data_service.service.parsers.XmlParserUtils.*;

@Service
public class XmlParser {

    public static final Logger log = LoggerFactory.getLogger(XmlParser.class);

    private final DocumentBuilder documentBuilder;
    private final SchemaHandler schemaHandler;

    public XmlParser(SchemaHandler schemaHandler) throws ParserConfigurationException {
        documentBuilder = DocumentBuilderFactory.newDefaultInstance().newDocumentBuilder();
        this.schemaHandler = schemaHandler;
    }

    public Map<String, Object> parseByScheme(MultipartFile xmlFile,
                                             SchemaDto schemaDto,
                                             Integer srid) throws XmlParserException {
        Map<String, Object> result = new HashMap<>();

        List<String> schemaProperties = schemaDto.getProperties()
                                                 .stream()
                                                 .map(simplePropertyDto -> simplePropertyDto.getName().toLowerCase())
                                                 .collect(Collectors.toList());

        try (InputStream inputStream = xmlFile.getInputStream()) {
            // read from a project's resources folder
            Document doc = documentBuilder.parse(inputStream);
            doc.getDocumentElement().normalize();

            NodeList nodeList = doc.getElementsByTagName("*");
            for (int i = 0; i < nodeList.getLength(); i++) {
                // Get element
                Element element = (Element) nodeList.item(i);
                String tagElementName = element.getTagName();
                // adding elements parsing
                if (schemaProperties.contains(tagElementName.toLowerCase())) {
                    result.putAll(parseElements(doc, tagElementName));
                }
                // adding attribute parsing
                if (element.getAttributes().getLength() > 0) {
                    result.putAll(parseAttributes(element, schemaProperties));
                }
                // adding geometry parsing
                Optional<String> geometryFieldName = schemaHandler.getPropertyNameByType(ValueType.GEOMETRY,
                                                                                         schemaDto.getProperties());

                if (tagElementName.equalsIgnoreCase("EntitySpatial")
                        && geometryFieldName.isPresent()
                        && !result.containsKey(geometryFieldName.get())) {
                    result.putAll(parseGeometry(doc.getElementsByTagName(tagElementName),
                                                srid,
                                                geometryFieldName.get()));
                }
            }
        } catch (IOException | SAXException e) {
            String msg = "Something went wrong while xml parsing of file" + e.getMessage();
            log.error(msg);
            throw new XmlParserException(msg);
        }

        return result;
    }

    private Map<String, Object> parseGeometry(NodeList nodeList, Integer srid,
                                              String geometryFieldName) {
        Map<String, Object> result = new HashMap<>();

        List<Polygon> polygons = new ArrayList<>();

        IntStream.range(0, nodeList.getLength())
                 .mapToObj(i -> (Element) nodeList.item(i))
                 .map(rootEntitySpatialElement -> getElementsByTag(rootEntitySpatialElement, "SpatialElement"))
                 .forEach(spatialElements -> {
                     List<Point> pointsList = new ArrayList<>();
                     Element rootSpatialElement = spatialElements.get(0);
                     getElementsByTag(rootSpatialElement, "SpelementUnit")
                             .stream()
                             .map(rootSpelementUnit -> getElementsByTag(rootSpelementUnit, "Ordinate"))
                             .forEach(ordinates -> ordinates
                                     .forEach(rootOrdinate -> {
                                         Point coordinate = new Point(
                                                 Double.parseDouble(rootOrdinate.getAttribute("Y")),
                                                 Double.parseDouble(rootOrdinate.getAttribute("X")));
                                         pointsList.add(coordinate);
                                     }));

                     LinearRing linearRing = new LinearRing(pointsList.toArray(Point[]::new));
                     Polygon polygon = new Polygon(new LinearRing[]{linearRing});
                     polygons.add(polygon);
                 });

        MultiPolygon multiPolygon = new MultiPolygon(polygons.toArray(Polygon[]::new));
        multiPolygon.setSrid(srid);
        result.put(geometryFieldName.toLowerCase(), multiPolygon);

        return result;
    }

    private Map<String, Object> parseElements(Document doc, String tagElementName) {
        Map<String, Object> result = new HashMap<>();
        NodeList nodeList = doc.getElementsByTagName(tagElementName);
        String dbValue = "";
        if (Objects.nonNull(nodeList) && nodeList.getLength() > 0) {
            dbValue = nodeList.item(0).getTextContent();
            // processing of area tag, because of nested
            if (tagElementName.equalsIgnoreCase("area")) {
                Element rootAreaElement = (Element) nodeList.item(0);
                nodeList = rootAreaElement.getElementsByTagName(tagElementName);
                dbValue = nodeList.getLength() > 0 ? nodeList.item(0).getTextContent(): "";
            }

            if (tagElementName.equalsIgnoreCase("address")) {
                Element rootAreaElement = (Element) nodeList.item(0);
                if (Objects.nonNull(rootAreaElement)) {
                    dbValue = addressProcessing(rootAreaElement);
                }
            }
        }

        if (!dbValue.isBlank()) {
            result.put(tagElementName.toLowerCase(), dbValue);
        }

        return result;
    }

    private Map<String, Object> parseAttributes(Element element, List<String> fieldsOfScheme) {
        Map<String, Object> result = new HashMap<>();
        IntStream.range(0, element.getAttributes().getLength())
                 .forEach(j -> {
                     String attributeName = element.getAttributes().item(j).getNodeName();
                     if (fieldsOfScheme.contains(attributeName.toLowerCase())) {
                         String attributeValue = element.getAttributes().item(j).getTextContent();
                         result.put(attributeName.toLowerCase(), attributeValue);
                     }
                 });

        return result;
    }

    private String addressProcessing(Element addressElement) {
        StringBuilder addressBuilder = new StringBuilder();

        getElementByTagTextContent(addressElement, "Region")
                .ifPresent(region -> addressBuilder.append("Код региона: ").append(region).append(". "));

        getAttributeByTag(addressElement, "District", "Name")
                .ifPresent(district -> addressBuilder.append("Наименование района: ").append(district).append(". "));

        getAttributeByTag(addressElement, "City", "Name")
                .ifPresent(city -> addressBuilder.append("Муниципальное образование: ").append(city).append(". "));

        getAttributeByTag(addressElement, "Locality", "Name")
                .ifPresent(locality -> addressBuilder.append("Населенный пункт: ").append(locality).append(". "));

        getAttributeByTag(addressElement, "Street", "Name")
                .ifPresent(street -> addressBuilder.append("Улица: ").append(street).append(". "));

        getElementByTagTextContent(addressElement, "Other")
                .ifPresent(other -> addressBuilder.append("Дополнительные сведения о местоположении: ")
                                                  .append(other)
                                                  .append(". "));

        return addressBuilder.toString();
    }
}
