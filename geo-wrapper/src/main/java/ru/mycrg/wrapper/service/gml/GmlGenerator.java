package ru.mycrg.wrapper.service.gml;

import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKBReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import ru.mycrg.common.*;
import ru.mycrg.wrapper.mq.IMqEvents;
import ru.mycrg.wrapper.service.CacheService;
import ru.mycrg.wrapper.service.FileService;
import ru.mycrg.wrapper.service.validation.Util;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.util.*;

import static ru.mycrg.common.enums.ProcessStatus.PENDING;
import static ru.mycrg.wrapper.service.gml.GmlUtil.*;

@Service
public class GmlGenerator {

    private static final Logger log = LoggerFactory.getLogger(GmlGenerator.class);

    private WKBReader wkb = new WKBReader();
    private long idCounter = 1;

    private final IMqEvents mqEvents;
    private final FileService fileService;
    private final CacheService cacheService;

    public GmlGenerator(FileService fileService, IMqEvents mqEvents, CacheService cacheService) {
        this.mqEvents = mqEvents;
        this.fileService = fileService;
        this.cacheService = cacheService;
    }

    /**
     * Генерируем GML.
     *
     * @param gmlMqRequest Источник данных
     * @return Ссылку на сгенерированный файл
     */
    public Map<String, String> generate(GmlMqRequest gmlMqRequest) throws ParserConfigurationException,
            TransformerException {
        idCounter = 1;
        log.info("Start gml generation");

        Map<String, String> paths = new HashMap<>();
        GmlDocumentHolder documentHolder = createDomDocuments(gmlMqRequest);

        mqEvents.gmlResponse(new GmlMqResponse(gmlMqRequest.getId(), PENDING, "Генерация файлов"));

        String randomFileName = UUID.randomUUID().toString().substring(0, 8);
        String pathToGml = fileService.save(documentHolder.getGmlDocument(), randomFileName + ".gml");
        // String pathToLog = fileService.save(documentHolder.getLogDocument(), randomFileName + ".log");

        paths.put("gml", pathToGml);
        // paths.put("log", pathToLog);

        return paths;
    }

    /**
     * Сгенерируем dom модели основного файла с данными и лога с ошибками, предварительно проведя валидацию.
     *
     * @param request Запрос
     * @return Обертка содержащая основной файл и лог файл.
     */
    @NotNull
    private GmlDocumentHolder createDomDocuments(GmlMqRequest request) throws ParserConfigurationException {
        mqEvents.gmlResponse(new GmlMqResponse(request.getId(), PENDING, "Инициализация..."));

        GmlDocumentHolder docHolder = createXmlDocument(request.getDocSchema());

        log.debug("Handle {} sources", request.getResourceProjections().size());
        request
                .getResourceProjections()
                .forEach(resource -> handleResource(request.getFgistpRules(), docHolder, resource));

        return docHolder;
    }

    private void handleResource(List<EntityTypeDto> rules, GmlDocumentHolder docHolder, ResourceProjection resource) {
        log.debug("Handle source: {}", resource.toString());

        try {
            EntityTypeDto feature = getRuleByTableName(rules, resource.getTableName());

            addFeatureToDocument(docHolder, feature, cacheService.fetchData(resource));
            // generateLogDomModel(docHolder, feature, cacheService.fetchViolations(resource));
        } catch (Exception e) {
            log.error("Ошибка при обработке ресурса: " + resource.toString(), e);
        }
    }

    private void generateLogDomModel(GmlDocumentHolder docHolder,
                                     EntityTypeDto fType,
                                     Queue<List<Map<String, Object>>> queue) {
        log.debug("generate LOG Document for feature: {}", fType.getName());

        Document logDocument = docHolder.getLogDocument();
        Element logRootNode = docHolder.getLogRootNode();

        Element feature = logDocument.createElement("featureMember");
        feature.setAttribute("name", fType.getOriginName());

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
                log.error("Error parsing violations");
            }
        }
    }

    private void addFeatureToDocument(GmlDocumentHolder docHolder,
                                      EntityTypeDto feature,
                                      Queue<List<Map<String, Object>>> queue) {
        log.debug("generate GML Document for feature {}", feature.getName());

        while (!queue.isEmpty()) {
            // Обрабатываем партию данных из БД
            queue.poll().forEach(propFromDb -> {
                String id = generateId();
                Element featureMember = addFeatureMember(docHolder, feature.getOriginName(), id);

                // Выгружаются только те свойства что прописаны в 10 приказе, тобишь feature.getProperties()
                feature.getProperties().stream()
                        .sorted(Comparator.comparingInt(SimplePropertyDto::getSequenceNumber))
                        .forEach(simplePropertyDto -> fillFeatureMember(featureMember, docHolder.getGmlDocument(),
                                propFromDb, simplePropertyDto));

                // Отдельно обрабатываем геометрию
                Object crg_b_geometry = propFromDb.get("crg_b_geometry");
                if (crg_b_geometry != null) {
                    Geometry geometry;
                    try {
                        geometry = wkb.read((byte[]) crg_b_geometry);

                        generateGeometry(geometry, docHolder.getGmlDocument(), featureMember);
                    } catch (ParseException e) {
                        log.warn("Ошибка при попытке распарсить геометрию. {}", e.getLocalizedMessage());
                    }
                }

                addObjectMember(docHolder, id, feature.getDescription(), propFromDb.get("classid"));
            });
        }
    }

    private void addObjectMember(GmlDocumentHolder docHolder, String id, String description, Object classid) {
        Document gmlDocument = docHolder.getGmlDocument();
        Element objectCollection = docHolder.getObjectCollection();

        Element objectNode = gmlDocument.createElement("Object");
        objectNode.setAttribute("IDREF", id);

        Element functionNode = gmlDocument.createElement("Function");
        functionNode.setTextContent(description);
        objectNode.appendChild(functionNode);

        Element nameNode = gmlDocument.createElement("Name");
        nameNode.setTextContent(description);
        objectNode.appendChild(nameNode);

        Element classIdNode = gmlDocument.createElement("ClassID");
        classIdNode.setTextContent(classid.toString());
        objectNode.appendChild(classIdNode);

        objectCollection.appendChild(objectNode);
    }

    /**
     * Наполняем featureMember свойствами
     */
    private void fillFeatureMember(Element featureMember, Document document,
                                   Map<String, Object> dbProp, SimplePropertyDto targetProperty) {
        dbProp.forEach((key, value) -> {
            if (targetProperty.getName().toLowerCase().equals(key.toLowerCase())) {
                Element prop = document.createElement(key.toUpperCase());
                if (value != null && !value.toString().isEmpty()) {
                    prop.setTextContent(getString(value));
                    featureMember.appendChild(prop);
                } else {
                    // Значение isRequired то сгенерируем дефолтное иначе невключаем в gml
                    if (targetProperty.isRequired()) {
                        prop.setTextContent(getDefaultValue(targetProperty));
                        featureMember.appendChild(prop);
                    }
                }
            }
        });
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

    private Element addFeatureMember(GmlDocumentHolder documentHolder, String name, String id) {
        Document document = documentHolder.getGmlDocument();

        Element gmlFeatureMember = document.createElement("gml:featureMember");
        documentHolder.getGmlFeatureCollection().appendChild(gmlFeatureMember);

        Element featureNode = document.createElement(name);
        featureNode.setAttribute("gml:id", id);

        gmlFeatureMember.appendChild(featureNode);

        return featureNode;
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
     */
    private GmlDocumentHolder createXmlDocument(String docSchema) throws ParserConfigurationException {
        log.debug("create xml document");

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

    @NotNull
    private String generateId() {
        idCounter++;

        return "ID" + idCounter;
    }
}
