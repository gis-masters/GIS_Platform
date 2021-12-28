package ru.mycrg.data_service.service.parsers;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.postgis.MultiPolygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.*;
import org.xml.sax.SAXException;
import ru.mycrg.data_service.service.parsers.exceptions.XmlParserException;
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
import java.util.stream.Stream;

import static ru.mycrg.data_service.service.parsers.XmlParserUtils.*;
import static ru.mycrg.data_service.util.SchemaUtil.getPropertyNameByType;

@Service
public class XmlParser {

    private static final Logger log = LoggerFactory.getLogger(XmlParser.class);

    private final DocumentBuilder documentBuilder;
    private final GeometryFactory geometryFactory;

    private final TransformationGeometryUtils transformationGeometryUtils;

    public XmlParser(TransformationGeometryUtils transformationGeometryUtils) throws ParserConfigurationException {
        this.transformationGeometryUtils = transformationGeometryUtils;

        DocumentBuilderFactory factory = DocumentBuilderFactory.newDefaultInstance();
        factory.setNamespaceAware(true);
        this.documentBuilder = factory.newDocumentBuilder();
        this.geometryFactory = new GeometryFactory();
    }

    public Map<String, Object> parseByScheme(MultipartFile xmlFile,
                                             List<SimplePropertyDto> simpleProperties,
                                             Integer srid,
                                             boolean isSchemaZu2) {
        Map<String, Object> result = new HashMap<>();

        List<String> schemaProperties = simpleProperties.stream()
                                                        .map(dto -> dto.getName().toLowerCase())
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
            Document doc = documentBuilder.parse(inputStream);
            doc.getDocumentElement().normalize();
            NodeList allNodes = doc.getElementsByTagName("*");

            Optional<Node> oEntitySpatialNode = getEntitySpatialNode(allNodes);
            if (oEntitySpatialNode.isEmpty()) {
                String msg = "Координатное описание данного XML не удовлетворяет требованиям.";
                log.warn(msg);

                throw new XmlParserException(msg);
            }

            for (int i = 0; i < allNodes.getLength(); i++) {
                Node node = allNodes.item(i);
                String nodeName = node.getNodeName();

                // Parse attributes
                NamedNodeMap nodeAttributes = node.getAttributes();
                if (nodeAttributes.getLength() > 0) {
                    result.putAll(parseAttributes(nodeAttributes, schemaProperties));
                }

                // Parse child elements
                if (schemaProperties.contains(nodeName.toLowerCase())) {
                    result.putAll(parseElements(doc, nodeName));
                }
            }

            // Parse geometry
            getPropertyNameByType(ValueType.GEOMETRY, simpleProperties).ifPresent(geometryFieldName -> {
                if (!result.containsKey(geometryFieldName)) {
                    NodeList allEntitySpatialNodes = doc.getElementsByTagName(oEntitySpatialNode.get().getNodeName());
                    MultiPolygon multiPolygon = parseGeometry(allEntitySpatialNodes, srid);

                    result.put(geometryFieldName.toLowerCase(), multiPolygon);
                }
            });
        } catch (IOException | SAXException e) {
            String msg = "Что-то пошло не так во время обработки xml файла " + e.getMessage();
            log.error(msg);
            throw new XmlParserException(msg);
        }

        if (isSchemaZu2) {
            mapResultForZuSchema(result, mapFieldsForZuSchema);
        }

        return result;
    }

    private MultiPolygon parseGeometry(NodeList allEntitySpatialNodes, Integer srid) {
        List<Polygon> polygons = new ArrayList<>();
        for (int i = 0; i < allEntitySpatialNodes.getLength(); i++) {
            polygons.addAll(parseEntitySpacial(allEntitySpatialNodes.item(i)));
        }

        if (!polygons.isEmpty()) {
            return transformationGeometryUtils.makeMultiPolygon(polygons, srid);
        } else {
            return new MultiPolygon();
        }
    }

    private List<Polygon> parseEntitySpacial(Node entitySpatial) {
        return getSpatialElements(entitySpatial)
                .map(this::parseSpatialElement)
                .collect(Collectors.toList());
    }

    private Polygon parseSpatialElement(Node spatialElement) {
        List<Coordinate> coordinates = getSpelementUnits(spatialElement)
                .map(this::parseSpelementUnit)
                .collect(Collectors.toList());

        return geometryFactory.createPolygon(coordinates.toArray(Coordinate[]::new));
    }

    private Coordinate parseSpelementUnit(Node spelementUnit) {
        Optional<Node> oOrdinate = getOrdinate(spelementUnit);
        if (oOrdinate.isPresent()) {
            return parseOrdinate(oOrdinate.get());
        } else {
            throw new XmlParserException("Incorrect spelementUnit: " + spelementUnit.getNodeName());
        }
    }

    private Coordinate parseOrdinate(Node ordinate) {
        Map<String, Object> result = parseAttributes(ordinate.getAttributes(), List.of("x", "y"));

        return new Coordinate(
                Double.parseDouble((String) result.get("y")),
                Double.parseDouble((String) result.get("x"))
        );
    }

    private boolean isEntitySpatialNode(String nodeName) {
        return nodeName.toLowerCase().contains("entity") && nodeName.toLowerCase().contains("spatial");
    }

    private boolean isSpatialElementNode(String nodeName) {
        return nodeName.toLowerCase().contains("spatial") && nodeName.toLowerCase().contains("element");
    }

    private boolean isSpelementUnitNode(String nodeName) {
        return nodeName.toLowerCase().contains("spelement") && nodeName.toLowerCase().contains("unit");
    }

    private boolean isOrdinateNode(String nodeName) {
        return nodeName.toLowerCase().contains("ordinate");
    }

    private Optional<Node> getEntitySpatialNode(NodeList allNodes) {
        for (int i = 0; i < allNodes.getLength(); i++) {
            if (isEntitySpatialNode(allNodes.item(i).getNodeName())) {
                return Optional.ofNullable(allNodes.item(i));
            }
        }

        return Optional.empty();
    }

    private Stream<Node> getSpatialElements(Node entitySpatial) {
        return IntStream.range(0, entitySpatial.getChildNodes().getLength())
                        .mapToObj(entitySpatial.getChildNodes()::item)
                        .filter(node -> isSpatialElementNode(node.getNodeName()));
    }

    private Stream<Node> getSpelementUnits(Node spatialElement) {
        return IntStream.range(0, spatialElement.getChildNodes().getLength())
                        .mapToObj(spatialElement.getChildNodes()::item)
                        .filter(node -> isSpelementUnitNode(node.getNodeName()));
    }

    private Optional<Node> getOrdinate(Node spelementUnit) {
        return IntStream.range(0, spelementUnit.getChildNodes().getLength())
                        .mapToObj(spelementUnit.getChildNodes()::item)
                        .filter(node -> isOrdinateNode(node.getNodeName()))
                        .findFirst();
    }

    private Map<String, Object> parseElements(Document doc, String tagElementName) {
        NodeList nodeList = doc.getElementsByTagName(tagElementName);
        Map<String, Object> result = new HashMap<>();

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

        String otherAddress = getElementTextContentByTag(addressElement, "Other").orElse("");

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

        mapFieldsForZuSchema.keySet().forEach(key -> {
            if (key.equalsIgnoreCase("utilization")) {
                resultForCheck.put(mapFieldsForZuSchema.get(key), resultForCheck.get(key));
            }

            if (key.equalsIgnoreCase("category")) {
                resultForCheck.put(mapFieldsForZuSchema.get(key), category);
            } else if (resultForCheck.containsKey(key)) {
                resultForCheck.put(mapFieldsForZuSchema.get(key), resultForCheck.get(key));
                resultForCheck.remove(key, resultForCheck.get(key));
            }
        });

        while (resultForCheck.values().remove(null)) ;
    }
}
