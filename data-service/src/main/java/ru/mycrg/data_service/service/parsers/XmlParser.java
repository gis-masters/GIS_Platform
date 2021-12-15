package ru.mycrg.data_service.service.parsers;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.postgis.MultiPolygon;
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
import ru.mycrg.data_service.util.CrsHandler;
import ru.mycrg.data_service.util.TransformationGeometryUtils;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
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
import static ru.mycrg.data_service.util.SchemaUtil.getPropertyNameByType;

@Service
public class XmlParser {

    private static final Logger log = LoggerFactory.getLogger(XmlParser.class);

    private final DocumentBuilder documentBuilder;
    private final TransformationGeometryUtils transformationGeometryUtils;
    private final CrsHandler crsHandler;

    public XmlParser(TransformationGeometryUtils transformationGeometryUtils,
                     CrsHandler crsHandler) throws ParserConfigurationException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        this.transformationGeometryUtils = transformationGeometryUtils;
        this.documentBuilder = factory.newDocumentBuilder();
        this.crsHandler = crsHandler;
    }

    public Map<String, Object> parseByScheme(MultipartFile xmlFile,
                                             List<SimplePropertyDto> simpleProperties,
                                             Integer srid,
                                             boolean isSchemaZu2) {
        Map<String, Object> result = new HashMap<>();

        List<String> schemaProperties = simpleProperties.stream()
                                                        .map(simplePropertyDto -> simplePropertyDto.getName()
                                                                                                   .toLowerCase())
                                                        .collect(Collectors.toList());

        Map<String, String> mapFieldsForZuSchema = new HashMap<>();
        mapFieldsForZuSchema.put("address", "raddress");
        mapFieldsForZuSchema.put("cadastralnumber", "cad_num");
        mapFieldsForZuSchema.put("area", "area_doc");
        mapFieldsForZuSchema.put("category", "ccode");
        mapFieldsForZuSchema.put("utilization", "category");
        if (isSchemaZu2) {
            schemaProperties.addAll(mapFieldsForZuSchema.keySet());
        }
        try (InputStream inputStream = xmlFile.getInputStream()) {
            // read from a project's resources folder
            Document doc = documentBuilder.parse(inputStream);
            doc.getDocumentElement().normalize();

            if (doc.getElementsByTagName("EntitySpatial").getLength() == 0) {
                String msg = "Xml файл не содержит пространственные данные";
                log.warn(msg);
                throw new XmlParserException(msg);
            }

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
                Optional<String> geometryFieldName = getPropertyNameByType(ValueType.GEOMETRY, simpleProperties);

                if (tagElementName.equalsIgnoreCase("EntitySpatial")
                        && geometryFieldName.isPresent()
                        && !result.containsKey(geometryFieldName.get())) {
                    result.putAll(parseGeometry(doc.getElementsByTagName(tagElementName),
                                                srid,
                                                geometryFieldName.get()));
                }
            }
        } catch (IOException | SAXException e) {
            String msg = "Что-то пошло не так во время парсинга xml файла " + e.getMessage();
            log.error(msg);
            throw new XmlParserException(msg);
        }
        if (isSchemaZu2) {
            mapResultForZuSchema(result, mapFieldsForZuSchema);
        }

        return result;
    }

    private Map<String, Object> parseGeometry(NodeList nodeList,
                                              Integer srid,
                                              String geometryFieldName) {
        Map<String, Object> result = new HashMap<>();
        GeometryFactory geometryFactory = new GeometryFactory();

        List<org.locationtech.jts.geom.Polygon> polygons = new ArrayList<>();

        IntStream.range(0, nodeList.getLength())
                 .mapToObj(i -> (Element) nodeList.item(i))
                 .map(rootEntitySpatialElement -> getElementsByTag(rootEntitySpatialElement,
                                                                   Collections.singletonList("SpatialElement")))
                 .forEach(spatialElements -> {
                     for (Element rootSpatialElement: spatialElements) {
                         List<Coordinate> coordinateList = new ArrayList<>();
                         getElementsByTag(rootSpatialElement, Collections.singletonList("SpelementUnit"))
                                 .stream()
                                 .map(rootSpelementUnit -> getElementsByTag(rootSpelementUnit, Arrays.asList("Ordinate",
                                                                                                             "NewOrdinate",
                                                                                                             "OldOrdinate")))
                                 .forEach(ordinates -> ordinates
                                         .forEach(rootOrdinate -> {
                                             Coordinate coordinate = new Coordinate(
                                                     Double.parseDouble(rootOrdinate.getAttribute("Y")),
                                                     Double.parseDouble(rootOrdinate.getAttribute("X"))
                                             );
                                             coordinateList.add(coordinate);
                                         }));

                         org.locationtech.jts.geom.Polygon polygon =
                                 geometryFactory.createPolygon(coordinateList.toArray(Coordinate[]::new));
                         polygons.add(polygon);
                     }
                 });

        if (!polygons.isEmpty()) {
            Geometry geometry = geometryFactory
                    .createMultiPolygon(polygons.toArray(org.locationtech.jts.geom.Polygon[]::new));

            final List<Coordinate> transformedCoordinates =
                    transformationGeometryUtils.transform(geometry,
                                                          crsHandler.defineCrsByX(polygons.get(0).getCoordinate().x),
                                                          crsHandler.defineCrsBySrid(srid));

            List<Polygon> convertGeometryOfPolygons = transformationGeometryUtils
                    .convertPolygonListToCorrectGeometryType(polygons, transformedCoordinates);
            MultiPolygon multiPolygon = new MultiPolygon(convertGeometryOfPolygons.toArray(Polygon[]::new));
            multiPolygon.setSrid(srid);

            result.put(geometryFieldName.toLowerCase(), multiPolygon);
        }

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
                dbValue = nodeList.getLength() > 0 ? nodeList.item(0).getTextContent() : "";
            }

            if (tagElementName.equalsIgnoreCase("address")) {
                Element rootAreaElement = (Element) nodeList.item(0);
                if (Objects.nonNull(rootAreaElement)) {
                    dbValue = addressProcessing(rootAreaElement);
                }
            }
            if (tagElementName.equalsIgnoreCase("utilization")) {
                Element rootAreaElement = (Element) nodeList.item(0);
                dbValue = rootAreaElement.getAttribute("ByDoc");
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

        getAttributeByTag(addressElement, "District", "Name")
                .ifPresent(district -> addressBuilder.append(district).append(". "));

        getAttributeByTag(addressElement, "City", "Name")
                .ifPresent(city -> addressBuilder.append(city).append(". "));

        getAttributeByTag(addressElement, "Locality", "Name")
                .ifPresent(locality -> addressBuilder.append(locality).append(". "));

        getAttributeByTag(addressElement, "Street", "Name")
                .ifPresent(street -> addressBuilder.append(street).append(". "));

        String otherAddress = getElementByTagTextContent(addressElement, "Other").orElse("");

        if (addressBuilder.toString().length() > otherAddress.length()) {
            return addressBuilder.toString();
        } else {
            return otherAddress;
        }
    }

    //TODO: Исправить такой способ мапинга в схему ZU2 (костыль)
    private void mapResultForZuSchema(Map<String, Object> resultForCheck,
                                      Map<String, String> mapFieldsForZuSchema) {
        Object category = resultForCheck.get("category");

        for (Map.Entry<String, String> entry: mapFieldsForZuSchema.entrySet()) {
            String key = entry.getKey();
            if (key.equalsIgnoreCase("utilization")) {
                resultForCheck.put(mapFieldsForZuSchema.get(key), resultForCheck.get(key));
            }
            if (key.equalsIgnoreCase("category")) {
                resultForCheck.put(mapFieldsForZuSchema.get(key), category);
            } else if (resultForCheck.containsKey(key)) {
                resultForCheck.put(mapFieldsForZuSchema.get(key), resultForCheck.get(key));
                resultForCheck.remove(key, resultForCheck.get(key));
            }
        }
        while (resultForCheck.values().remove(null)) ;
    }
}
