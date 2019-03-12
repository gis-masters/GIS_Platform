package ru.mycrg.wrapper.service.gml;

import org.geotools.feature.SchemaException;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKBReader;
import org.opengis.feature.simple.SimpleFeatureType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.GmlMqRequest;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.wrapper.dao.GisStorage;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.math.BigDecimal;
import java.util.*;

@Service
public class GmlGenerator {

    private static final Logger log = LoggerFactory.getLogger(GmlGenerator.class);

    private final int BATCH_SIZE = 100;
    private int idCounter = 1;

    private final GisStorage gisStorage;

    public GmlGenerator(GisStorage gisStorage) {
        this.gisStorage = gisStorage;
    }

    /**
     * Генерируем GML.
     *
     * @param gmlMqRequest Источник данных
     * @return Ссылку на сгенерированный файл
     */
    public String generate(GmlMqRequest gmlMqRequest) throws ParserConfigurationException, TransformerException {
        log.info("Start gml generation. idCounter: {}", idCounter);

        GmlDocumentHolder documentHolder = createGml(gmlMqRequest);

        return saveFile(documentHolder);
    }

    @NotNull
    public GmlDocumentHolder createGml(GmlMqRequest gmlMqRequest) throws ParserConfigurationException {
        GmlDocumentHolder documentHolder = createXmlDocument(gmlMqRequest.getDocSchema());

        log.debug("{} sources", gmlMqRequest.getResourceProjections().size());
        gmlMqRequest.getResourceProjections().forEach(resourceProjection -> {
            getFgistpRuleByTableName(gmlMqRequest.getFgistpRules(), resourceProjection.getTableName())
                    .ifPresentOrElse(rule -> {
                                writeDataToGml(documentHolder, rule, getData(resourceProjection));
                            },
                            () -> {
                                log.warn("Не найдено описание типа: " + resourceProjection.getTableName());
                            });
        });

        return documentHolder;
    }

    private String saveFile(GmlDocumentHolder documentHolder) throws TransformerException {
        log.debug("Save Document to file");

        DOMSource source = new DOMSource(documentHolder.getDocument());

        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        StreamResult result = new StreamResult("/opt/fgistp.gml");
        transformer.transform(source, result);

        File file = new File("/opt/fgistp.gml");
        if (file.exists() && !file.isDirectory()) {
            return file.getAbsolutePath();
        }

        return "";
    }

    private void writeDataToGml(GmlDocumentHolder documentHolder, EntityTypeDto entityType,
                                Queue<List<Map<String, Object>>> queue) {
        log.debug("write feature {} to GML Document", entityType.getName());

        while (!queue.isEmpty()) {
            // Обрабатываем партию данных из БД
            queue.poll().forEach(propFromDb -> {
                Element featureMember = addFeatureMember(documentHolder, entityType.getClearName());

                propFromDb.forEach((key, value) -> {
                    fillFeatureMember(documentHolder.getDocument(), entityType.getProperties(), featureMember,
                            key, value);
                });
            });
        }
    }

    /**
     * Наполняем featureMember свойствами
     */
    private void fillFeatureMember(Document document, List<SimplePropertyDto> properties, Element featureMember,
                                   String key, Object value) {
        if (key.toLowerCase().equals("crg_b_geometry") || key.toLowerCase().equals("crg_t_geometry")) {
            SimpleFeatureType TYPE = null;
//            try {
//                WKBReader wkb = new WKBReader();
//
//                SimpleFeatureBuilder.build(TYPE, new Object[] { wkb.read((byte[]) value)},null);
//
//                ByteArrayOutputStream xml = new ByteArrayOutputStream();
//
////                GML encode2 = new GML(Version.GML2);
////                encode2.setLegacy(true);
////                encode2.setBaseURL(baseURL);
////                encode2.setNamespace("location", "location.xsd");
////                encode2.encode(xml,  new ListFeatureCollection(TYPE, collection));
////
////                xml.close();
//
//                String gml = xml.toString();
//            } catch (SchemaException | ParseException e) {
//                e.printStackTrace();
//            }
        }

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
        Document document = documentHolder.getDocument();

        Element gmlFeatureMember = document.createElement("gml:featureMember");
        documentHolder.getFeatureCollection().appendChild(gmlFeatureMember);

        Element featureNode = document.createElement(name);
        featureNode.setAttribute("gml:id", generateId());

        gmlFeatureMember.appendChild(featureNode);

        return featureNode;
    }

    private boolean isPropertyExist(List<SimplePropertyDto> properties, String key) {
        return properties
                .stream()
                .anyMatch(property -> {
                    if (property.getName() != null && key != null) {
                        return key.toLowerCase().equals(property.getName().toLowerCase());
                    } else {
                        return false;
                    }
                });
    }

    private Optional<SimplePropertyDto> getPropertyByName(List<SimplePropertyDto> properties, String key) {
        return properties
                .stream()
                .filter(property -> property.getName() != null && key != null)
                .findFirst();
    }

    /**
     * Создаем xml document заполняем шапку, создаем корневую и основные ноды
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
        Document doc = builder.newDocument();

        // Root node
        Element rootNode = doc.createElement(docSchema);
        rootNode.setAttribute("xmlns", "http://fgistp");
        rootNode.setAttribute("xmlns:gml", "http://www.opengis.net/gml");
        doc.appendChild(rootNode);

        // Base node
        Element featureCollection = doc.createElement("FeatureCollection");
        rootNode.appendChild(featureCollection);

        Element gmlFeatureCollection = doc.createElement("gml:FeatureCollection");
        gmlFeatureCollection.setAttribute("gml:id", "featureID1");
        featureCollection.appendChild(gmlFeatureCollection);

        // Base node
        Element objectCollection = doc.createElement("ObjectCollection");
        rootNode.appendChild(objectCollection);

        return new GmlDocumentHolder(doc, gmlFeatureCollection, objectCollection);
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

    private Optional<EntityTypeDto> getFgistpRuleByTableName(List<EntityTypeDto> entityTypes, String tableName) {
        return entityTypes.stream()
                .filter(entityType -> entityType.getClearName().toLowerCase().equals(tableName.toLowerCase()))
                .findFirst();
    }

    private String generateId() {
        idCounter++;

        return "id" + idCounter;
    }
}
