package ru.mycrg.data_service.service.parsers;

import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.gml.GMLException;
import org.geotools.referencing.crs.AbstractCRS;
import org.geotools.wfs.GML;
import org.locationtech.jts.geom.Geometry;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.referencing.ReferenceIdentifier;
import org.postgis.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.parsers.exceptions.GmlParserException;
import ru.mycrg.data_service.service.parsers.model.FeatureData;
import ru.mycrg.data_service.service.parsers.model.FeatureObject;
import ru.mycrg.data_service.service.parsers.model.FeatureProperty;
import ru.mycrg.data_service.service.parsers.model.SimpleFeatureData;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static java.util.Objects.nonNull;
import static javax.xml.XMLConstants.ACCESS_EXTERNAL_DTD;
import static javax.xml.XMLConstants.ACCESS_EXTERNAL_SCHEMA;

@Service
public class GmlParser {

    private static final Logger log = LoggerFactory.getLogger(GmlParser.class);
    private static final String ERROR_MESSAGE = "Something went wrong while gml parsing of file";

    private final GML gml;
    private final DocumentBuilder documentBuilder;

    public GmlParser() throws ParserConfigurationException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        factory.setAttribute(ACCESS_EXTERNAL_DTD, "");
        factory.setAttribute(ACCESS_EXTERNAL_SCHEMA, "");

        this.documentBuilder = factory.newDocumentBuilder();

        this.gml = new GML(GML.Version.GML3);
    }

    public List<SimpleFeatureData> parseFeatureData(MultipartFile file) throws GMLException {
        try (SimpleFeatureIterator iter = gml.decodeFeatureIterator(file.getInputStream())) {
            return parseFeatures(iter);
        } catch (IOException | ParserConfigurationException | SAXException e) {
            String msg = ERROR_MESSAGE + e.getMessage();
            log.error(msg);

            throw new GMLException(msg);
        }
    }

    public FeatureData parseAttributes(MultipartFile file, SchemaDto schema, boolean invertCoordinates)
            throws GMLException {
        final String schemaName = schema.getOriginName();
        FeatureData result = new FeatureData();
        result.setName(schemaName);

        try (InputStream inputStream = file.getInputStream()) {
            Document doc = documentBuilder.parse(inputStream);
            doc.getDocumentElement().normalize();

            NodeList nodeList = doc.getElementsByTagNameNS("*", schemaName);
            List<FeatureObject> featureObjects = new ArrayList<>();

            for (int i = 0; i < nodeList.getLength(); i++) {
                Element element = (Element) nodeList.item(i);
                FeatureObject featureObject = prepareProperties(element, schema, invertCoordinates);
                if (!featureObject.getProperties().isEmpty()) {
                    featureObjects.add(featureObject);
                }
            }

            result.setObjects(featureObjects);
        } catch (IOException | SAXException e) {
            String msg = ERROR_MESSAGE + e.getMessage();
            log.error(msg);

            throw new GMLException(msg);
        }

        return result;
    }

    private List<SimpleFeatureData> parseFeatures(SimpleFeatureIterator featureIterator) {
        List<SimpleFeatureData> featureDataList = new ArrayList<>();
        while (featureIterator.hasNext()) {
            SimpleFeature feature = featureIterator.next();
            String schemaName = feature.getName().getLocalPart();

            Optional<SimpleFeatureData> existedSchema =
                    featureDataList.stream()
                                   .filter(geometryData -> geometryData.getSchemaName().equals(schemaName))
                                   .findFirst();
            SimpleFeatureData simpleFeatureData = new SimpleFeatureData();
            simpleFeatureData.setGeometryTypes("Point", "Polygon", "LineString");

            if (existedSchema.isPresent()) {
                simpleFeatureData = existedSchema.get();
            } else {
                simpleFeatureData.setSchemaName(schemaName);
            }

            if (nonNull(feature.getDefaultGeometry())) {
                Geometry defaultGeometry = (Geometry) feature.getDefaultGeometry();
                AbstractCRS userData = (AbstractCRS) defaultGeometry.getUserData();
                if (nonNull(userData)) {
                    final Optional<ReferenceIdentifier> oEpsgIdentifier = userData.getIdentifiers().stream().findFirst();
                    if (oEpsgIdentifier.isPresent()) {
                        simpleFeatureData.setEpsgCode(oEpsgIdentifier.get().toString());
                    }
                }
            }

            if (existedSchema.isEmpty()) {
                featureDataList.add(simpleFeatureData);
            }
        }

        return featureDataList;
    }

    private FeatureObject prepareProperties(Element element, SchemaDto schemaDto, boolean invertCoordinates) {
        final FeatureObject featureObject = new FeatureObject();
        try {
            String geometryType = getGeometryType(element);
            if (isSchemaWithAppropriateGeometryType(schemaDto, geometryType)) {
                List<FeatureProperty> objectProperties = new ArrayList<>();

                parsingElement(element, objectProperties, schemaDto.getProperties());
                parsingGeometry(element, objectProperties, invertCoordinates);

                featureObject.setProperties(objectProperties);
            }
        } catch (Exception ex) {
            String msg = String.format("Error while getting attribute in %s. %s", schemaDto.getName(), ex.getMessage());
            log.debug(msg);
        }

        return featureObject;
    }

    private boolean isSchemaWithAppropriateGeometryType(SchemaDto schemaDto, String geometryType) {
        String schemaType = schemaDto.getGeometryType().getType();

        if (schemaType.equals("MultiPolygon")) {
            return "polygon".equalsIgnoreCase(geometryType);
        } else if (schemaType.equals("MultiLineString")) {
            return "line".equalsIgnoreCase(geometryType);
        } else {
            return schemaType.equalsIgnoreCase(geometryType);
        }
    }

    private String getGeometryType(Element element) {
        if ((element.getElementsByTagName("gml:posList").getLength() > 0)
                || (element.getElementsByTagName("gml:pos").getLength() > 0)
                || (element.getElementsByTagName("gml:coordinates").getLength() > 0)) {

            if (element.getElementsByTagName("gml:Point").getLength() > 0) {
                return "point";
            } else if (element.getElementsByTagName("gml:Polygon").getLength() > 0) {
                return "polygon";
            } else if (element.getElementsByTagName("gml:LineString").getLength() > 0) {
                return "line";
            } else if (element.getElementsByTagName("gml:Curve").getLength() > 0) {
                return "line";
            } else {
                throw new GmlParserException("Undefined geometry type!");
            }
        } else {
            throw new GmlParserException("There is no geometry in object!");
        }
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
            property.setType(schemaProperty.getValueType());
            if (elementsByTagName.getLength() > 0) {
                Element propertyElement = (Element) elementsByTagName.item(0);
                String value = propertyElement.getTextContent();
                property.setValue(value);
            }
            objectProperties.add(property);
        }
    }

    private void parsingGeometry(Element element, List<FeatureProperty> objectProperties,
                                 boolean invertCoordinates) {
        if ((element.getElementsByTagName("gml:posList").getLength() > 0)
                || (element.getElementsByTagName("gml:pos").getLength() > 0)
                || (element.getElementsByTagName("gml:coordinates").getLength() > 0)) {
            FeatureProperty shape = objectProperties
                    .stream()
                    .filter(featureProperty -> "shape".equalsIgnoreCase(featureProperty.getName()))
                    .findFirst()
                    .orElseThrow();

            if (element.getElementsByTagName("gml:MultiCurve").getLength() > 0) {

                Element attributeElement = (Element) element.getElementsByTagName("gml:MultiCurve").item(0);
                Integer srid = getCrs(attributeElement);

                List<Point> coordinatesFromElement = getCoordinatesFromElement(attributeElement, invertCoordinates);

                LineString lineString = new LineString(coordinatesFromElement.toArray(Point[]::new));
                MultiLineString multiLineString = new MultiLineString(List.of(lineString).toArray(LineString[]::new));
                multiLineString.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(multiLineString);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:MultiSurface").getLength() > 0) {

                Element multiSurfaceElement = (Element) element.getElementsByTagName("gml:MultiSurface").item(0);
                Integer srid = getCrs(multiSurfaceElement);
                NodeList allLineStrings = multiSurfaceElement.getElementsByTagName("gml:LinearRing");

                List<LinearRing> linearRingList = new ArrayList<>();
                for (int i = 0; i < allLineStrings.getLength(); i++) {
                    Element linearRingElement = (Element) allLineStrings.item(i);

                    List<Point> coordinateList = getCoordinatesFromElement(linearRingElement, invertCoordinates);

                    LinearRing linearRing = new LinearRing(coordinateList.toArray(Point[]::new));
                    linearRingList.add(linearRing);
                }
                Polygon polygon = new Polygon(linearRingList.toArray(LinearRing[]::new));
                MultiPolygon multiPolygon = new MultiPolygon(List.of(polygon).toArray(Polygon[]::new));
                multiPolygon.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(multiPolygon);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:MultiPoint").getLength() > 0) {

                Element multiPointElement = (Element) element.getElementsByTagName("gml:MultiPoint").item(0);
                Integer srid = getCrs(multiPointElement);

                Point point = getCoordinatesFromElement(multiPointElement, invertCoordinates).get(0);
                point.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(point);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:Point").getLength() > 0) {

                Element attributeElement = (Element) element.getElementsByTagName("gml:Point").item(0);
                Integer srid = getCrs(attributeElement);

                Point point = getCoordinatesFromElement(attributeElement, invertCoordinates).get(0);
                point.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(point);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:Polygon").getLength() > 0) {
                Element polygonElement = (Element) element.getElementsByTagName("gml:Polygon").item(0);
                Integer srid = getCrs(polygonElement);
                NodeList allLinearRing = polygonElement.getElementsByTagName("gml:LinearRing");
                List<LinearRing> linearRingList = new ArrayList<>();
                for (int i = 0; i < allLinearRing.getLength(); i++) {
                    Element linearRingElement = (Element) allLinearRing.item(i);

                    List<Point> coordinateList = getCoordinatesFromElement(linearRingElement, invertCoordinates);

                    LinearRing linearRing = new LinearRing(coordinateList.toArray(Point[]::new));
                    linearRingList.add(linearRing);
                }
                Polygon polygon = new Polygon(linearRingList.toArray(LinearRing[]::new));
                MultiPolygon multiPolygon = new MultiPolygon(List.of(polygon).toArray(Polygon[]::new));
                multiPolygon.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(multiPolygon);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:LineString").getLength() > 0) {
                Element attributeElement = (Element) element.getElementsByTagName("gml:LineString").item(0);
                Integer srid = getCrs(attributeElement);
                List<Point> coordinateList = getCoordinatesFromElement(attributeElement, invertCoordinates);

                LineString lineString = new LineString(coordinateList.toArray(Point[]::new));
                MultiLineString multiLineString = new MultiLineString(List.of(lineString).toArray(LineString[]::new));
                multiLineString.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(multiLineString);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:Curve").getLength() > 0) {
                Element attributeElement = (Element) element.getElementsByTagName("gml:Curve").item(0);
                Integer srid = getCrs(attributeElement);
                int quantityOfPosList = element.getElementsByTagName("gml:posList").getLength();
                List<LineString> lineStrings = new ArrayList<>();
                for (int i = 0; i < quantityOfPosList; i++) {
                    List<Point> coordinateList = getCoordinatesFromPosList(attributeElement, i, invertCoordinates);
                    LineString lineString = new LineString(coordinateList.toArray(Point[]::new));
                    lineStrings.add(lineString);
                }

                MultiLineString multiLineString = new MultiLineString(lineStrings.toArray(LineString[]::new));
                multiLineString.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(multiLineString);
                shape.setValue(pGgeometry);
            }
        }
    }

    private List<Point> getCoordinatesFromElement(Element element, boolean invertCoordinates) {
        NodeList coordinateElement = element.getElementsByTagName("gml:coordinates");
        List<Point> coordinateList = new ArrayList<>();
        if (coordinateElement.getLength() > 0) {
            String coordinates = coordinateElement.item(0).getTextContent();
            String[] points = coordinates.split("\\s+");
            for (String pointCoordinate: points) {
                String[] pointXY = pointCoordinate.split(",");
                if (pointXY.length == 2) {
                    double pointX = Double.parseDouble(pointXY[1]);
                    double pointY = Double.parseDouble(pointXY[0]);
                    Point point = invertCoordinates
                            ? new Point(pointY, pointX)
                            : new Point(pointX, pointY);
                    coordinateList.add(point);
                }
            }
        } else {
            coordinateList = getCoordinatesFromPosList(element, 0, invertCoordinates);
        }

        return coordinateList;
    }

    private List<Point> getCoordinatesFromPosList(Element element, int posListNumber, boolean invertCoordinates) {
        String coordinates = "";

        if (element.getElementsByTagName("gml:posList").getLength() > 0) {
            coordinates = element.getElementsByTagName("gml:posList").item(posListNumber).getTextContent();
        } else if (element.getElementsByTagName("gml:pos").getLength() > 0) {
            coordinates = element.getElementsByTagName("gml:pos").item(posListNumber).getTextContent();
        }

        String[] splitCoordinates = coordinates.split("\\s+");

        List<Point> coordinateList = new ArrayList<>();
        if (splitCoordinates.length % 2 == 0) {
            for (int i = 0; i < splitCoordinates.length; i = i + 2) {
                double pointX = Double.parseDouble(splitCoordinates[i + 1]);
                double pointY = Double.parseDouble(splitCoordinates[i]);
                Point point = invertCoordinates
                        ? new Point(pointY, pointX)
                        : new Point(pointX, pointY);
                coordinateList.add(point);
            }
        } else {
            String msg = "Element has incorrect geometry!";
            log.error(msg);

            throw new GmlParserException(msg);
        }

        return coordinateList;
    }

    private Integer getCrs(Element geometryElement) {
        String srsName = geometryElement.getAttribute("srsName");
        String[] epsg = srsName.split("EPSG:");
        if (epsg.length >= 2) {
            return Integer.parseInt(epsg[1]);
        } else {
            String errorMsg = "Error while getting EPSG code (srid).";
            log.error(errorMsg);

            throw new DataServiceException(errorMsg);
        }
    }
}
