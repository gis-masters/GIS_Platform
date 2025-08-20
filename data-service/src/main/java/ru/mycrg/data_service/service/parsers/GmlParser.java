package ru.mycrg.data_service.service.parsers;

import org.apache.commons.lang3.StringUtils;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.gml.GMLException;
import org.geotools.referencing.crs.AbstractCRS;
import org.geotools.wfs.GML;
import org.locationtech.jts.geom.Geometry;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.referencing.ReferenceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.import_.gml_geometry_handlers.IGmlImportGeometryHandler;
import ru.mycrg.data_service.service.parsers.exceptions.EpsgParserException;
import ru.mycrg.data_service.service.parsers.exceptions.GmlParserException;
import ru.mycrg.data_service.service.parsers.model.FeatureData;
import ru.mycrg.data_service.service.parsers.model.FeatureObject;
import ru.mycrg.data_service.service.parsers.model.FeatureProperty;
import ru.mycrg.data_service.service.parsers.model.SimpleFeatureData;
import ru.mycrg.data_service.service.parsers.utils.GmlParserUtils;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.GeometryType;
import ru.mycrg.data_service_contract.enums.ValueType;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.function.Function;

import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toMap;
import static javax.xml.XMLConstants.ACCESS_EXTERNAL_DTD;
import static javax.xml.XMLConstants.ACCESS_EXTERNAL_SCHEMA;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service_contract.enums.GeometryType.GEOMETRY_COLLECTION;
import static ru.mycrg.data_service_contract.enums.ValueType.*;

@Service
public class GmlParser {

    private static final Logger log = LoggerFactory.getLogger(GmlParser.class);

    private final GML gml;
    private final DocumentBuilder documentBuilder;
    private final Map<String, IGmlImportGeometryHandler> gmlImportGeometryHandlers;

    public GmlParser(List<IGmlImportGeometryHandler> geomHandlers) throws ParserConfigurationException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        factory.setAttribute(ACCESS_EXTERNAL_DTD, "");
        factory.setAttribute(ACCESS_EXTERNAL_SCHEMA, "");

        this.documentBuilder = factory.newDocumentBuilder();

        this.gml = new GML(GML.Version.GML3);

        gmlImportGeometryHandlers = geomHandlers
                .stream()
                .collect(toMap(IGmlImportGeometryHandler::getType, Function.identity()));
    }

    public List<SimpleFeatureData> parseFeatures(Resource file) {
        try (SimpleFeatureIterator featureIterator = gml.decodeFeatureIterator(file.getInputStream())) {
            List<SimpleFeatureData> featureDataList = new ArrayList<>();
            while (featureIterator.hasNext()) {
                parseFeature(featureIterator.next(), featureDataList);
            }

            return featureDataList;
        } catch (Exception e) {
            log.error("Не удалось распарсить фичи => {}", e.getMessage());

            return List.of();
        }
    }

    private static void parseFeature(SimpleFeature feature, List<SimpleFeatureData> featureDataList) {
        try {
            SimpleFeatureData simpleFeatureData = new SimpleFeatureData();
            simpleFeatureData.setGeometryTypes("Point", "Polygon", "LineString");

            String schemaName = getSchemaName(feature);
            Optional<SimpleFeatureData> existedSchema =
                    featureDataList.stream()
                                   .filter(geometryData -> geometryData.getSchemaName().equals(schemaName))
                                   .findFirst();
            if (existedSchema.isPresent()) {
                simpleFeatureData = existedSchema.get();
            } else {
                simpleFeatureData.setSchemaName(schemaName);
            }

            if (nonNull(feature.getDefaultGeometry())) {
                Geometry defaultGeometry = (Geometry) feature.getDefaultGeometry();
                Object userData = defaultGeometry.getUserData();
                if (userData instanceof AbstractCRS) {
                    AbstractCRS abstractCrs = (AbstractCRS) userData;
                    Optional<ReferenceIdentifier> oEpsgIdentifier = abstractCrs.getIdentifiers().stream().findFirst();
                    if (oEpsgIdentifier.isPresent()) {
                        simpleFeatureData.setEpsgCode(oEpsgIdentifier.get().toString());
                    }
                } else {
                    log.trace("Геометрия объекта: '{}.{}' не типа AbstractCRS: не удаётся получить систему координат",
                              schemaName, feature.getID());
                }
            } else {
                log.debug("Фича: '{}.{}' не содержит DefaultGeometry", schemaName, feature.getID());
            }

            if (existedSchema.isEmpty()) {
                featureDataList.add(simpleFeatureData);
            }
        } catch (Exception e) {
            logError("Не удалось распарсить фичу: '" + feature.getID() + "'", e);
        }
    }

    public String getBboxCrs(Resource file) throws GMLException {
        try (InputStream inputStream = file.getInputStream()) {
            Document doc = documentBuilder.parse(inputStream);
            doc.getDocumentElement().normalize();

            NodeList nodeList = doc.getElementsByTagName("gml:Envelope");
            if (nodeList.getLength() > 0) {
                Element envelope = (Element) nodeList.item(0);

                return envelope.getAttribute("srsName");
            }

            return null;
        } catch (IOException | SAXException e) {
            log.error("Не удалось взять bbox => {}", e.getMessage(), e);

            return null;
        }
    }

    public FeatureData parseAttributes(Resource file, SchemaDto schema, boolean invertCoordinates, String defaultCrs)
            throws GMLException {
        final String schemaName = schema.getOriginName();
        final String schemaNameWithGeometry = joinSchemaNameWithGeometry(schema);
        FeatureData result = new FeatureData();
        result.setName(schemaName);

        try (InputStream inputStream = file.getInputStream()) {
            Document doc = documentBuilder.parse(inputStream);
            doc.getDocumentElement().normalize();

            NodeList nodeList = doc.getElementsByTagNameNS("*", schemaName);
            if (nodeList.getLength() == 0) {
                nodeList = doc.getElementsByTagNameNS("*", schemaNameWithGeometry);
            }

            List<FeatureObject> featureObjects = new ArrayList<>();

            for (int i = 0; i < nodeList.getLength(); i++) {
                Element element = (Element) nodeList.item(i);
                FeatureObject featureObject = prepareProperties(element, schema, invertCoordinates, defaultCrs);
                if (!featureObject.getProperties().isEmpty()) {
                    featureObjects.add(featureObject);
                }
            }

            result.setObjects(featureObjects);
        } catch (IOException | SAXException e) {
            String msg = "Не удалось распарсить атрибуты => " + e.getMessage();
            log.error(msg, e);

            throw new GMLException(msg);
        }

        return result;
    }

    private static String joinSchemaNameWithGeometry(SchemaDto schema) {
        String geometryType = "";

        if (GeometryType.POINT.equals(schema.getGeometryType())) {
            geometryType = schema.getGeometryType().getType();
        } else if (GeometryType.MULTI_LINE_STRING.equals(schema.getGeometryType())) {
            geometryType = "Line";
        } else if (GeometryType.MULTI_POLYGON.equals(schema.getGeometryType())) {
            geometryType = "Polygon";
        }

        return String.format("%s_%s", schema.getOriginName(), geometryType);
    }

    private static String getSchemaName(SimpleFeature feature) {
        String schemaName = feature.getName().getLocalPart();
        if (StringUtils.containsIgnoreCase(schemaName, "_polygon")) {
            schemaName = StringUtils.removeIgnoreCase(schemaName, "_polygon");
        }
        if (StringUtils.containsIgnoreCase(schemaName, "_point")) {
            schemaName = StringUtils.removeIgnoreCase(schemaName, "_point");
        }
        if (StringUtils.containsIgnoreCase(schemaName, "_line")) {
            schemaName = StringUtils.removeIgnoreCase(schemaName, "_line");
        }

        return schemaName;
    }

    private FeatureObject prepareProperties(Element element,
                                            SchemaDto schemaDto,
                                            boolean invertCoordinates,
                                            String defaultEpsg) {
        final FeatureObject featureObject = new FeatureObject();
        try {
            String geometryType = getGeometryType(element);
            if (isSchemaWithAppropriateGeometryType(schemaDto, geometryType)) {
                List<FeatureProperty> objectProperties = new ArrayList<>();

                parsingElement(element, objectProperties, schemaDto.getProperties());
                parsingGeometry(element, objectProperties, invertCoordinates, defaultEpsg);

                featureObject.setProperties(objectProperties);
            }
        } catch (EpsgParserException epsgParserException) {
            throw new DataServiceException(epsgParserException.getMessage());
        } catch (Exception ex) {
            String msg = String.format("Ошибка получения атрибутов из %s. %s", schemaDto.getName(), ex.getMessage());
            log.debug(msg);
        }

        return featureObject;
    }

    private boolean isSchemaWithAppropriateGeometryType(SchemaDto schemaDto, String geometryType) {
        String schemaType = schemaDto.getGeometryType().getType();
        if (geometryType.equalsIgnoreCase(GEOMETRY_COLLECTION.getType())) {
            return true;
        } else if (schemaType.equals("MultiPolygon")) {
            return "polygon".equalsIgnoreCase(geometryType);
        } else if (schemaType.equals("MultiLineString")) {
            return "line".equalsIgnoreCase(geometryType);
        } else {
            return schemaType.equalsIgnoreCase(geometryType);
        }
    }

    private String getGeometryType(Element element) {
        if (isElementContainsGeometry(element)) {
            throw new GmlParserException("There is no geometry in object!");
        }
        if (element.getElementsByTagName("gml:GeometryCollection").getLength() > 0) {
            return "GeometryCollection";
        } else if (element.getElementsByTagName("gml:Point").getLength() > 0) {
            return "point";
        } else if (element.getElementsByTagName("gml:Polygon").getLength() > 0) {
            return "polygon";
        } else if (element.getElementsByTagName("gml:PolygonPatch").getLength() > 0) {
            return "polygon";
        } else if (element.getElementsByTagName("gml:LineString").getLength() > 0) {
            return "line";
        } else if (element.getElementsByTagName("gml:Curve").getLength() > 0) {
            return "line";
        } else {
            throw new GmlParserException("Геометрия невалидного типа!");
        }
    }

    private static boolean isElementContainsGeometry(Element element) {
        return element.getElementsByTagName("gml:posList").getLength() <= 0
                && element.getElementsByTagName("gml:pos").getLength() <= 0
                && element.getElementsByTagName("gml:coordinates").getLength() <= 0;
    }

    private void parsingElement(Element element,
                                List<FeatureProperty> objectProperties,
                                List<SimplePropertyDto> schemaProperties) {
        for (SimplePropertyDto schemaProperty: schemaProperties) {
            FeatureProperty property = new FeatureProperty();
            String propertyName = schemaProperty.getName().toLowerCase();
            property.setName(propertyName);
            NodeList elementsByTagName = element.getElementsByTagNameNS("*", propertyName.toUpperCase());
            if (elementsByTagName.getLength() == 0) {
                elementsByTagName = element.getElementsByTagNameNS("*", propertyName);
                if (elementsByTagName.getLength() == 0) {
                    elementsByTagName = element.getElementsByTagNameNS("*", StringUtils.capitalize(propertyName));
                }
            }

            property.setType(defineValueType(schemaProperty));
            if (elementsByTagName.getLength() > 0) {
                Element propertyElement = (Element) elementsByTagName.item(0);
                String value = propertyElement.getTextContent();
                property.setValue(value);
            }

            objectProperties.add(property);
        }
    }

    private void parsingGeometry(Element element,
                                 List<FeatureProperty> objectProperties,
                                 boolean invertCoordinates,
                                 String defaultEpsg) {
        if (isElementContainsGeometry(element)) {
            log.warn("Элемент не содержит геометрию! '{}'", element.getTextContent());

            return;
        }

        FeatureProperty shape = objectProperties
                .stream()
                .filter(featureProperty -> DEFAULT_GEOMETRY_COLUMN_NAME.equalsIgnoreCase(featureProperty.getName()))
                .findFirst()
                .orElseThrow();

        IGmlImportGeometryHandler geometryHandler = gmlImportGeometryHandlers
                .get(GmlParserUtils.getGeometryType(element));
        if (Objects.isNull(geometryHandler)) {
            log.warn("Не удалось обработать геометрию у элемента '{}'", element.getTextContent());

            return;
        }
        geometryHandler.generate(element, invertCoordinates, defaultEpsg)
                       .ifPresent(shape::setValue);
    }

    private ValueType defineValueType(SimplePropertyDto schemaProperty) {
        ValueType vType;
        if (CHOICE.equals(schemaProperty.getValueTypeAsEnum())) {
            if (schemaProperty.getForeignKeyType() == null) {
                log.trace("Не задан параметр: foreignKeyType для свойства типа CHOICE: '{}'. " +
                                  "По дефолту будет использован STRING", schemaProperty.getName());

                vType = schemaProperty.getValueTypeAsEnum();
            } else {
                switch (schemaProperty.getForeignKeyType()) {
                    case LONG:
                    case INTEGER:
                        vType = INT;
                        break;
                    default:
                        vType = STRING;
                }
            }
        } else {
            vType = schemaProperty.getValueTypeAsEnum();
        }

        return vType;
    }
}
