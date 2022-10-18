package ru.mycrg.wrapper.service.export;

import org.jetbrains.annotations.NotNull;
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
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ExportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.exceptions.ExportException;
import ru.mycrg.wrapper.service.FileService;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.util.*;

import static java.io.File.separator;
import static java.util.Objects.nonNull;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.*;
import static ru.mycrg.wrapper.dao.DaoProperties.BATCH_SIZE;
import static ru.mycrg.wrapper.dao.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.wrapper.service.export.GmlUtil.*;

@Service
public class GmlGenerator implements IExporter {

    private static final String GML_ID = "gml:id";

    private final Logger log = LoggerFactory.getLogger(GmlGenerator.class);

    private final WKBReader wkb = new WKBReader();
    private long idCounter = 1;
    private long totalRows = 0;
    private long processedRows = 0;

    private final IMessageBusProducer messageBus;
    private final FileService fileService;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    private final DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    private final TransformerFactory transformerFactory = TransformerFactory.newInstance();

    public GmlGenerator(FileService fileService,
                        IMessageBusProducer messageBus,
                        DatasourceFactory datasourceFactory,
                        BaseDaoService baseDaoService) {
        this.messageBus = messageBus;
        this.fileService = fileService;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    /**
     * Генерируем GML.
     *
     * @param event Запрос с данными
     *
     * @return Ссылку на сгенерированный файл
     */
    public String generate(ExportRequestEvent event) {
        idCounter = 1;
        log.debug("Start gml generation");

        String path;
        GmlDocumentHolder documentHolder = createDomDocuments(event);

        String randomFileName = UUID.randomUUID().toString().substring(0, 8);
        path = saveXml(documentHolder.getGmlDocument(), randomFileName + ".gml");

        log.debug("Done gml generation");

        return path;
    }

    /**
     * Сгенерируем dom модели основного файла с данными и лога с ошибками, предварительно проведя валидацию.
     *
     * @param event Запрос
     *
     * @return Обертка содержащая основной файл и лог файл.
     */
    @NotNull
    private GmlDocumentHolder createDomDocuments(ExportRequestEvent event) {
        try {
            ExportProcessModel payload = event.getPayload();

            GmlDocumentHolder docHolder = createXmlDocument(payload.getDocSchema());

            ExportResponseEvent mqResponse = new ExportResponseEvent(event, PENDING, "Инициализация", 2);
            messageBus.produce(mqResponse);

            log.debug("Handle {} sources", payload.getResourceProjections().size());

            processedRows = 0;
            totalRows = calculateTotalRows(payload);
            payload.getResourceProjections()
                   .forEach(resource -> handleResource(event, docHolder, resource));

            return docHolder;
        } catch (ParserConfigurationException e) {
            throw new ExportException("Ошибка экспорта", e);
        }
    }

    private long calculateTotalRows(ExportProcessModel request) {
        return request.getResourceProjections().stream()
                      .mapToLong(baseDaoService::countTotalRows)
                      .sum();
    }

    private void handleResource(ExportRequestEvent event,
                                GmlDocumentHolder docHolder,
                                ResourceProjection resource) {
        log.debug("Handle source: {}", resource);

        try {
            ExportProcessModel payload = event.getPayload();

            SchemaDto schema = resource.getSchema();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(resource.getDbName());

            int offset = 0;
            while (true) {
                List<Map<String, Object>> batch = baseDaoService.fetchBatch(jdbcTemplate, resource, PRIMARY_KEY,
                                                                            BATCH_SIZE, offset, payload.getEpsg());
                if (batch.isEmpty()) {
                    break;
                }

                batch.forEach(propFromDb -> {
                    String id = generateId();
                    Element featureMember = addFeatureMember(docHolder, schema.getOriginName(), id);

                    // Выгружаются только те свойства что прописаны в 10 приказе, тобишь schema.getProperties()
                    schema.getProperties().stream()
                          .sorted(Comparator.comparingInt(SimplePropertyDto::getSequenceNumber))
                          .forEach(simplePropertyDto -> fillFeatureMember(featureMember, docHolder.getGmlDocument(),
                                                                          propFromDb, simplePropertyDto));

                    // Отдельно обрабатываем геометрию
                    Object crgBGeometry = propFromDb.get("crg_b_geometry");
                    if (crgBGeometry != null) {
                        Geometry geometry;
                        try {
                            geometry = wkb.read((byte[]) crgBGeometry);

                            generateGeometry(geometry, docHolder.getGmlDocument(), featureMember, payload);
                        } catch (ParseException e) {
                            log.warn("Ошибка при попытке распарсить геометрию. {}", e.getLocalizedMessage());
                        }
                    }

                    addObjectMember(docHolder, id, schema.getDescription(), propFromDb.get("classid"));
                });

                processedRows += batch.size();

                ExportResponseEvent mqResponse = new ExportResponseEvent(event, TASK_DONE,
                                                                         "Обработка " + schema.getTitle(),
                                                                         calculatePercent(processedRows, totalRows),
                                                                         resource.getTableName());
                messageBus.produce(mqResponse);

                offset++;
            }
        } catch (Exception e) {
            log.error("Ошибка при обработке ресурса: {} / {}", resource, e.getMessage());

            final String description = "Не удалось обработать слой: " + resource.getTableName();
            ExportResponseEvent mqResponse = new ExportResponseEvent(event, TASK_ERROR, description,
                                                                     calculatePercent(processedRows, totalRows),
                                                                     resource.getTableName(),
                                                                     e.getMessage());
            messageBus.produce(mqResponse);
        }
    }

    private void addObjectMember(GmlDocumentHolder docHolder, String id, String description, Object classId) {
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
        classIdNode.setTextContent(nonNull(classId) ? classId.toString() : "");
        objectNode.appendChild(classIdNode);

        objectCollection.appendChild(objectNode);
    }

    /**
     * Наполняем featureMember свойствами
     */
    private void fillFeatureMember(Element featureMember, Document document,
                                   Map<String, Object> dbProp, SimplePropertyDto targetProperty) {
        dbProp.forEach((key, value) -> {
            if (targetProperty.getName().toLowerCase().equalsIgnoreCase(key)) {
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

    private void generateGeometry(Geometry geometry,
                                  Document document,
                                  Element featureMember,
                                  ExportProcessModel payload) {
        String geometryType = geometry.getGeometryType();

        final String geometrySRSName = "srsName";
        final String geometrySRSValue = "urn:ogc:def:crs:EPSG:" + payload.getEpsg();
        final String gmlCoordinates = "gml:coordinates";
        boolean invertedCoordinates = payload.isInvertedCoordinates();

        if ("Point".equals(geometryType)) {
            Element geometryElement = document.createElement("gml:Point");
            geometryElement.setAttribute(geometrySRSName, geometrySRSValue);
            geometryElement.setAttribute(GML_ID, generateId());
            featureMember.appendChild(geometryElement);

            Element coordinate = document.createElement(gmlCoordinates);
            coordinate.setTextContent(convertToString(geometry.getCoordinates(), invertedCoordinates));
            geometryElement.appendChild(coordinate);
        } else if ("MultiLineString".equals(geometryType)) {
            Element geometryElement = document.createElement("gml:LineString");
            geometryElement.setAttribute(geometrySRSName, geometrySRSValue);
            geometryElement.setAttribute(GML_ID, generateId());
            featureMember.appendChild(geometryElement);

            Element coordinate = document.createElement(gmlCoordinates);
            coordinate.setTextContent(convertToString(geometry.getCoordinates(), invertedCoordinates));
            geometryElement.appendChild(coordinate);
        } else if ("MultiPolygon".equals(geometryType)) {
            Element geometryElement = document.createElement("gml:Polygon");
            geometryElement.setAttribute(geometrySRSName, geometrySRSValue);
            geometryElement.setAttribute(GML_ID, generateId());
            featureMember.appendChild(geometryElement);

            Polygon onlyFirstGeometry = (Polygon) geometry.getGeometryN(0);
            LineString exteriorRing = onlyFirstGeometry.getExteriorRing();
            if (exteriorRing != null) {
                Element exterior = document.createElement("gml:exterior");
                geometryElement.appendChild(exterior);

                Element linearRing = document.createElement("gml:LinearRing");
                exterior.appendChild(linearRing);

                Element coordinate = document.createElement(gmlCoordinates);
                coordinate.setTextContent(convertToString(exteriorRing.getCoordinates(), invertedCoordinates));
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

                    Element coordinate = document.createElement(gmlCoordinates);
                    coordinate.setTextContent(convertToString(hole.getCoordinates(), invertedCoordinates));
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
        featureNode.setAttribute(GML_ID, id);

        gmlFeatureMember.appendChild(featureNode);

        return featureNode;
    }

    /**
     * Создаем xml document заполняем шапку, создаем корневую и основные ноды для основного файла и пустую ноду для лог
     * файла.
     *
     * @param docSchema Схема документов территориального планирования: <ul>
     *                  <li> Doc.10501010100 – Положение о территориальном планировании в области федерального
     *                  транспорта;
     *                  <li> Doc.10502010100 – Положение о территориальном планировании в области федерального
     *                  транспорта (в части трубопроводного транспорта)
     *                  <li> Doc.10504010100 – Положение о территориальном планировании в области энергетики
     *                  <li> Doc.10505010100 – Положение о территориальном планировании в области высшего образования
     *                  <li> Doc.10506010100 – Положение о территориальном планировании в области здравоохранения
     *                  <li> Doc.10803010100 – Положение о территориальном планировании субъекта Российской Федерации
     *                  <li> Doc.20101010000 – Положение о территориальном планировании муниципального района
     *                  <li> Doc.20201010000 – Положение о территориальном планировании поселения
     *                  <li> Doc.20301010000 – Положение о территориальном планировании городского округа.<ul>
     *
     * @return Объект содержащий document и все ключевые ноды.
     */
    private GmlDocumentHolder createXmlDocument(String docSchema) throws ParserConfigurationException {
        log.debug("create xml document");

        DocumentBuilder builder = factory.newDocumentBuilder();
        Document mainDoc = builder.newDocument();

        // Gml Root node
        Element rootNode = mainDoc.createElement(docSchema);
        rootNode.setAttribute("xmlns", "http://fgistp");
        rootNode.setAttribute("xmlns:gml", "http://www.opengis.net/gml");
        mainDoc.appendChild(rootNode);

        // Base node
        Element featureCollection = mainDoc.createElement("FeatureCollection");
        rootNode.appendChild(featureCollection);

        Element gmlFeatureCollection = mainDoc.createElement("gml:FeatureCollection");
        gmlFeatureCollection.setAttribute(GML_ID, "featureID1");
        featureCollection.appendChild(gmlFeatureCollection);

        // Base node
        Element objectCollection = mainDoc.createElement("ObjectCollection");
        rootNode.appendChild(objectCollection);

        return new GmlDocumentHolder(mainDoc, gmlFeatureCollection, objectCollection);
    }

    @NotNull
    private String generateId() {
        idCounter++;

        return "ID" + idCounter;
    }

    /**
     * Сохраняем xml document.
     *
     * @param document Сгенерированный xml
     * @param fileName Название файла
     *
     * @return Путь к сохраненному файлу
     */
    private String saveXml(Document document, String fileName) {
        log.debug("Save {} to file", fileName);

        try {
            DOMSource source = new DOMSource(document);

            Transformer transformer = transformerFactory.newTransformer();
            StreamResult result = new StreamResult(fileService.getExportStoragePath() + separator + fileName);
            transformer.transform(source, result);
        } catch (TransformerException e) {
            throw new ExportException("Ошибка формирования GML", e);
        }

        return fileService.getPathToFile(fileName);
    }
}
