package ru.mycrg.wrapper.service.gml;

import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKBReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import ru.mycrg.common.*;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.wrapper.dao.GisStorage;
import ru.mycrg.wrapper.service.FileService;
import ru.mycrg.wrapper.service.validation.Util;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.*;

@Service
public class GmlGenerator {

    private static final Logger log = LoggerFactory.getLogger(GmlGenerator.class);

    private WKBReader wkb = new WKBReader();
    private final int BATCH_SIZE = 100;
    private long idCounter = 1;

    private final GisStorage gisStorage;
    private final FileService fileService;

    public GmlGenerator(GisStorage gisStorage, FileService fileService) {
        this.gisStorage = gisStorage;
        this.fileService = fileService;
    }

    /**
     * Генерируем GML.
     *
     * @param gmlMqRequest Источник данных
     * @return Ссылку на сгенерированный файл
     */
    public Map<String, String> generate(GmlMqRequest gmlMqRequest) throws ParserConfigurationException,
            TransformerException {
        log.info("Start gml generation. idCounter: {}", idCounter);
        Map<String, String> paths = new HashMap<>();

        GmlDocumentHolder documentHolder = createDomDocuments(gmlMqRequest);

        String randomFileName = UUID.randomUUID().toString().substring(0, 8);
        String pathToGml = fileService.save(documentHolder.getGmlDocument(),randomFileName + ".gml");
        String pathToLog = fileService.save(documentHolder.getLogDocument(),randomFileName + ".log");

        paths.put("gml", pathToGml);
        paths.put("log", pathToLog);

        return paths;
    }

    /**
     * Сгенерируем dom модели основного файла с данными и лога с ошибками, предварительно проведя валидацию.
     *
     * @param gmlMqRequest Запрос
     * @return Обертка содержащая основной файл и лог файл.
     */
    @NotNull
    public GmlDocumentHolder createDomDocuments(GmlMqRequest gmlMqRequest) throws ParserConfigurationException {
        GmlDocumentHolder documentHolder = createXmlDocument(gmlMqRequest.getDocSchema());

        log.debug("{} sources", gmlMqRequest.getResourceProjections().size());
        gmlMqRequest.getResourceProjections().forEach(resourceProjection -> {
            var rule = getRuleByTableName(gmlMqRequest.getFgistpRules(), resourceProjection.getTableName());
            if (rule.isPresent()) {
                generateGmlDomModel(documentHolder, rule.get(), resourceProjection);
                generateLogDomModel(documentHolder, rule.get(), resourceProjection);
            } else {
                log.warn("Не найдено описание типа: " + resourceProjection.getTableName());
            }
        });

        return documentHolder;
    }

    private void generateLogDomModel(GmlDocumentHolder docHolder, EntityTypeDto fType, ResourceProjection resource) {
        log.debug("generate LOG Document for feature: {}", fType.getName());

        Queue<List<Map<String, Object>>> queue = getViolationsData(resource);

        Document logDocument = docHolder.getLogDocument();
        Element logRootNode = docHolder.getLogRootNode();

        Element feature = logDocument.createElement("featureMember");
        feature.setAttribute("name", fType.getClearName());

        logRootNode.appendChild(feature);

        while (!queue.isEmpty()) {
            List<Map<String, Object>> batch = queue.poll();
            try {
                Util.mapToViolations(batch).forEach(violations -> {
                    Element object = logDocument.createElement("object");
                    object.setAttribute("id", violations.getObjectId());
                    feature.appendChild(object);

                    violations.getPropertyViolations().forEach(propertyViolation -> {
                        Element property = logDocument.createElement(propertyViolation.getName());
                        property.setTextContent(propertyViolation.getErrorTypes().get(0));
                        object.appendChild(property);
                    });

                    if (violations.getObjectViolations().size() > 0) {
                        Element property = logDocument.createElement("objectViolations");
                        property.setTextContent(violations.getObjectViolations().get(0));
                        object.appendChild(property);
                    }
                });
            } catch (IOException e) {
                log.error("Error parsin violations");
            }
        }
    }

    private void generateGmlDomModel(GmlDocumentHolder docHolder, EntityTypeDto fType, ResourceProjection resource) {
        log.debug("generate GML Document for feature {}", fType.getName());

        var queue = getData(resource);

        while (!queue.isEmpty()) {
            // Обрабатываем партию данных из БД
            queue.poll().forEach(propFromDb -> {
                Element featureMember = addFeatureMember(docHolder, fType.getClearName());

                propFromDb.forEach((key, value) ->
                        fillFeatureMember(docHolder.getGmlDocument(), fType.getProperties(), featureMember, key, value));
            });
        }
    }

    /**
     * Наполняем featureMember свойствами
     */
    private void fillFeatureMember(Document document, List<SimplePropertyDto> properties, Element featureMember,
                                   String key, Object value) {
        if ("crg_b_geometry".equals(key.toLowerCase())) {
            if (value != null) {
                Geometry geometry;
                try {
                    geometry = wkb.read((byte[]) value);

                    generateGeometry(geometry, document, featureMember);
                } catch (ParseException e) {
                    log.warn("Ошибка при попытке распарсить геометрию. {}", e.getLocalizedMessage());
                }
            } else {
                log.warn("Empty geometry?");
            }
        } else if ("shape".equals(key.toLowerCase())) {
            // Игнорируем.
        } else {
            // Выгружаются только те свойства что прописаны в 10 приказе
            Optional<SimplePropertyDto> propertyByName = getPropertyByName(properties, key);
            if (propertyByName.isPresent()) {
                Element prop = document.createElement(key.toUpperCase());
                if (value != null && !value.toString().isEmpty()) {
                    prop.setTextContent(getString(value));
                    featureMember.appendChild(prop);
                } else {
                    // Значение isRequired то сгенерируем дефолтное иначе невключаем в gml
                    SimplePropertyDto property = propertyByName.get();
                    if (property.isRequired()) {
                        prop.setTextContent(getDefaultValue(property));
                        featureMember.appendChild(prop);
                    }
                }
            } else {
                log.trace("Property {} does not exist in feature", key);
            }
        }
    }

    private void generateGeometry(Geometry geometry, Document document, Element featureMember) {
        String geometryType = geometry.getGeometryType();

        if ("Point".equals(geometryType)) {
            Element geometryElement = document.createElement("gml:Point");
            geometryElement.setAttribute("srsName", "urn:ogc:def:crs:EPSG:28406");
            geometryElement.setAttribute("gml:id", generateId());
            featureMember.appendChild(geometryElement);

            Element coordinate = document.createElement("gml:coordinates");
            coordinate.setTextContent(convertToString(geometry.getCoordinates()));
            geometryElement.appendChild(coordinate);
        } else if ("MultiLineString".equals(geometryType)) {
            Element geometryElement = document.createElement("gml:LineString");
            geometryElement.setAttribute("srsName", "urn:ogc:def:crs:EPSG:28406");
            geometryElement.setAttribute("gml:id", generateId());
            featureMember.appendChild(geometryElement);

            Element coordinate = document.createElement("gml:coordinates");
            coordinate.setTextContent(convertToString(geometry.getCoordinates()));
            geometryElement.appendChild(coordinate);
        } else if ("MultiPolygon".equals(geometryType)) {
            Element geometryElement = document.createElement("gml:Polygon");
            geometryElement.setAttribute("srsName", "urn:ogc:def:crs:EPSG:28406");
            geometryElement.setAttribute("gml:id", generateId());
            featureMember.appendChild(geometryElement);

            Polygon onlyFirstGeometry = (Polygon) geometry.getGeometryN(0);
            LineString exteriorRing = onlyFirstGeometry.getExteriorRing();
            if (exteriorRing != null) {
                Element exterior = document.createElement("gml:exterior");
                geometryElement.appendChild(exterior);

                Element linearRing = document.createElement("gml:LinearRing");
                exterior.appendChild(linearRing);

                Element coordinate = document.createElement("gml:coordinates");
                coordinate.setTextContent(convertToString(exteriorRing.getCoordinates()));
                linearRing.appendChild(coordinate);
            }

            int numInteriorRing = onlyFirstGeometry.getNumInteriorRing();
            if (numInteriorRing > 0) {
                for (int i = 0; i < numInteriorRing - 1; i++) {
                    LineString hole = onlyFirstGeometry.getInteriorRingN(i);

                    Element interior = document.createElement("gml:interior");
                    geometryElement.appendChild(interior);

                    Element linearRing = document.createElement("gml:LinearRing");
                    interior.appendChild(linearRing);

                    Element coordinate = document.createElement("gml:coordinates");
                    coordinate.setTextContent(convertToString(hole.getCoordinates()));
                    linearRing.appendChild(coordinate);
                }
            }
        } else {
            log.warn("Unsupported geometry type: {}", geometryType);
        }
    }

    private String convertToString(Coordinate[] coordinates) {
        StringBuilder result = new StringBuilder();
        for (Coordinate coordinate : coordinates) {
            result
                    .append(trimCoordinate(coordinate.x))
                    .append(",")
                    .append(trimCoordinate(coordinate.y))
                    .append(" ");
        }

        return result.toString().trim();
    }

    private String trimCoordinate(double d) {
        return new DecimalFormat("#0.00").format(d).replace(",", ".");
    }

    // Исправляем конвертацию BigDecimal -> "0E-8"
    private String getString(Object value) {
        if (value instanceof BigDecimal) {
            return ((BigDecimal) value).toPlainString();
        }

        return value.toString();
    }

    @NotNull
    private String getDefaultValue(SimplePropertyDto property) {
        if (property.getValueType() == ValueType.INT || property.getValueType() == ValueType.CHOICE) {
            return "0";
        }

        if (property.getValueType() == ValueType.DOUBLE) {
            return "0.0000";
        }

        return "";
    }

    private Element addFeatureMember(GmlDocumentHolder documentHolder, String name) {
        Document document = documentHolder.getGmlDocument();

        Element gmlFeatureMember = document.createElement("gml:featureMember");
        documentHolder.getGmlFeatureCollection().appendChild(gmlFeatureMember);

        Element featureNode = document.createElement(name);
        featureNode.setAttribute("gml:id", generateId());

        gmlFeatureMember.appendChild(featureNode);

        return featureNode;
    }

    private Optional<SimplePropertyDto> getPropertyByName(List<SimplePropertyDto> properties, String key) {
        return properties
                .stream()
                .filter(property -> property.getName() != null && key != null)
                .findFirst();
    }

    /**
     * Создаем xml document заполняем шапку, создаем корневую и основные ноды для основного файла
     * и пустую ноду для лог файла.
     *
     * @param docSchema Схема документов территориального планирования: <ul>
     *                  <li> Doc.10501010100 – Положение о территориальном планировании в области федерального транспорта;
     *                  <li> Doc.10502010100 – Положение о территориальном планировании в области федерального транспорта (в части трубопроводного транспорта)
     *                  <li> Doc.10504010100 – Положение о территориальном планировании в области энергетики
     *                  <li> Doc.10505010100 – Положение о территориальном планировании в области высшего образования
     *                  <li> Doc.10506010100 – Положение о территориальном планировании в области здравоохранения
     *                  <li> Doc.10803010100 – Положение о территориальном планировании субъекта Российской Федерации
     *                  <li> Doc.20101010000 – Положение о территориальном планировании муниципального района
     *                  <li> Doc.20201010000 – Положение о территориальном планировании поселения
     *                  <li> Doc.20301010000 – Положение о территориальном планировании городского округа.<ul>
     * @return Обьект содержащий document и все ключевые ноды.
     * @throws ParserConfigurationException
     */
    private GmlDocumentHolder createXmlDocument(String docSchema) throws ParserConfigurationException {
        log.debug("create file");

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document mainDoc = builder.newDocument();
        Document logDoc = builder.newDocument();

        // Gml Root node
        Element rootNode = mainDoc.createElement(docSchema);
        rootNode.setAttribute("xmlns", "http://fgistp");
        rootNode.setAttribute("xmlns:gml", "http://www.opengis.net/gml");
        mainDoc.appendChild(rootNode);

        // Base node
        Element featureCollection = mainDoc.createElement("FeatureCollection");
        rootNode.appendChild(featureCollection);

        Element gmlFeatureCollection = mainDoc.createElement("gml:FeatureCollection");
        gmlFeatureCollection.setAttribute("gml:id", "featureID1");
        featureCollection.appendChild(gmlFeatureCollection);

        // Base node
        Element objectCollection = mainDoc.createElement("ObjectCollection");
        rootNode.appendChild(objectCollection);

        // Log Root node
        Element logRootNode = logDoc.createElement(docSchema);
        logDoc.appendChild(logRootNode);

        return new GmlDocumentHolder(mainDoc, logDoc, gmlFeatureCollection, objectCollection, logRootNode);
    }

    private Queue<List<Map<String, Object>>> getData(ResourceProjection target) {
        log.debug("Get data from: {}", target.toString());

        Queue<List<Map<String, Object>>> queue = new ArrayDeque<>();
        JdbcTemplate jdbcTemplate = gisStorage.initConnection(target.getDbName());

        int offset = 0;
        while (true) {
            var batch = gisStorage.fetchBatch(jdbcTemplate, target, BATCH_SIZE, offset);
            if (batch.isEmpty()) {
                break;
            }

            queue.offer(batch);

            offset++;
        }

        return queue;
    }

    private Queue<List<Map<String, Object>>> getViolationsData(ResourceProjection target) {
        log.debug("Get violations from: {}", target.toString());

        Queue<List<Map<String, Object>>> queue = new ArrayDeque<>();
        JdbcTemplate jdbcTemplate = gisStorage.initConnection(target.getDbName());

        int offset = 0;
        while (true) {
            var batch = gisStorage.fetchViolationsBatch(jdbcTemplate, target, BATCH_SIZE, offset);
            if (batch.isEmpty()) {
                break;
            }

            queue.offer(batch);

            offset++;
        }

        return queue;
    }

    private Optional<EntityTypeDto> getRuleByTableName(List<EntityTypeDto> entityTypes, String tableName) {
        return entityTypes.stream()
                .filter(entityType -> entityType.getClearName().toLowerCase().equals(tableName.toLowerCase()))
                .findFirst();
    }

    private String generateId() {
        idCounter++;

        return "id" + idCounter;
    }
}
