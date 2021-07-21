package ru.mycrg.data_service.service.parsers;

import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.gml.GMLException;
import org.geotools.referencing.crs.DefaultProjectedCRS;
import org.geotools.wfs.GML;
import org.locationtech.jts.geom.Geometry;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.referencing.ReferenceIdentifier;
import org.postgis.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.parsers.exceptions.GmlParserException;
import ru.mycrg.data_service.service.parsers.model.Property;
import ru.mycrg.data_service.service.parsers.model.SchemaProperties;
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

@Service
public class GmlParser {

    private static final Logger log = LoggerFactory.getLogger(GmlParser.class);
    private static final String ERROR_MESSAGE = "Something went wrong while gml parsing of file";

    private final GML gml;
    private final DocumentBuilder documentBuilder;

    public GmlParser() throws ParserConfigurationException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        this.documentBuilder = factory.newDocumentBuilder();

        this.gml = new GML(GML.Version.GML3);
    }

    public List<SimpleFeatureData> parseFeatureData(MultipartFile file) throws GMLException {
        try (SimpleFeatureIterator iter = gml.decodeFeatureIterator(file.getInputStream())) {
            return parseTablesDtoFromFeature(iter);
        } catch (IOException | ParserConfigurationException | SAXException e) {
            String msg = ERROR_MESSAGE + e.getMessage();
            log.error(msg);

            throw new GMLException(msg);
        }
    }

    private List<SimpleFeatureData> parseTablesDtoFromFeature(SimpleFeatureIterator iter) {
        List<SimpleFeatureData> featureDataList = new ArrayList<>();
        while (iter.hasNext()) {
            SimpleFeature feature = iter.next();
            String schemaName = feature.getName().getLocalPart();

            Set<String> geoTypes = new HashSet<>();
            geoTypes.add("Point");
            geoTypes.add("Polygon");
            geoTypes.add("LineString");

            Optional<SimpleFeatureData> existedSchema =
                    featureDataList.stream()
                                   .filter(geometryData -> geometryData.getSchemaName().equals(schemaName))
                                   .findFirst();
            SimpleFeatureData simpleFeatureData = new SimpleFeatureData();
            if (existedSchema.isPresent()) {
                simpleFeatureData = existedSchema.get();
            } else {
                simpleFeatureData.setSchemaName(schemaName);
            }

            if (nonNull(feature.getDefaultGeometry())) {
                Geometry defaultGeometry = (Geometry) feature.getDefaultGeometry();
                DefaultProjectedCRS userData = (DefaultProjectedCRS) defaultGeometry.getUserData();
                if (nonNull(userData)) {
                    final Optional<ReferenceIdentifier> oEpsgIdentifier = userData.getIdentifiers().stream().findFirst();
                    if (oEpsgIdentifier.isPresent()) {
                        simpleFeatureData.setEpsgCode(oEpsgIdentifier.get().toString());
                    }
                }
            }

            simpleFeatureData.setTypeOfGeometry(geoTypes);

            if (existedSchema.isEmpty()) {
                featureDataList.add(simpleFeatureData);
            }
        }

        return featureDataList;
    }

    public SchemaProperties parseAttributes(MultipartFile file, SchemaDto schema) throws GMLException {
        final String schemaName = schema.getOriginName();
        SchemaProperties result = new SchemaProperties();
        result.setName(schemaName);

        try (InputStream inputStream = file.getInputStream()) {
            Document doc = documentBuilder.parse(inputStream);
            doc.getDocumentElement().normalize();

            NodeList nodeList = doc.getElementsByTagNameNS("*", schemaName);
            List<List<Property>> objects = new ArrayList<>();

            for (int i = 0; i < nodeList.getLength(); i++) {
                Element element = (Element) nodeList.item(i);
                List<Property> properties = prepareProperties(element, schema);
                if (!properties.isEmpty()) {
                    objects.add(properties);
                }
            }

            result.setObjects(objects);
        } catch (IOException | SAXException e) {
            String msg = ERROR_MESSAGE + e.getMessage();
            log.error(msg);

            throw new GMLException(msg);
        }

        return result;
    }

    private List<Property> prepareProperties(Element element, SchemaDto schemaDto) {
        List<Property> propertyList = new ArrayList<>();
        try {
            String geometryType = getGeometryType(element);
            if (isSchemaWithAppropriateGeometryType(schemaDto, geometryType)) {
                List<SimplePropertyDto> properties = schemaDto.getProperties();
                parsingElementToProperties(properties, element, propertyList);
                parsingGeometry(element, propertyList);
            }
        } catch (Exception ex) {
            String msg = String.format("Error while getting attribute in %s. %s", schemaDto.getName(), ex.getMessage());
            log.debug(msg);
        }

        return propertyList;
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
            } else {
                throw new GmlParserException("Undefined geometry type!");
            }
        } else {
            throw new GmlParserException("There is no geometry in object!");
        }
    }

    private void parsingElementToProperties(List<SimplePropertyDto> properties,
                                            Element element,
                                            List<Property> propertyList) {
        for (SimplePropertyDto property: properties) {
            Property propertyDto = new Property();
            String propertyName = property.getName().toUpperCase();
            propertyDto.setName(propertyName.toLowerCase());
            NodeList elementsByTagName = element.getElementsByTagNameNS("*", propertyName);
            propertyDto.setType(property.getValueType());
            if (elementsByTagName.getLength() > 0) {
                Element propertyElement = (Element) elementsByTagName.item(0);
                String value = propertyElement.getTextContent();
                propertyDto.setValue(value);
            }
            propertyList.add(propertyDto);
        }
    }

    private void parsingGeometry(Element element, List<Property> propertyList) {
        if ((element.getElementsByTagName("gml:posList").getLength() > 0)
                || (element.getElementsByTagName("gml:pos").getLength() > 0)
                || (element.getElementsByTagName("gml:coordinates").getLength() > 0)) {
            Property shape = propertyList.stream()
                                         .filter(property -> "shape".equalsIgnoreCase(property.getName()))
                                         .findFirst()
                                         .orElseThrow();

            if (element.getElementsByTagName("gml:MultiCurve").getLength() > 0) {

                Element attributeElement = (Element) element.getElementsByTagName("gml:MultiCurve").item(0);
                Integer srid = getCrs(attributeElement);

                List<Point> coordinatesFromPosList = getCoordinatesFromPosList(attributeElement);

                LineString lineString = new LineString(coordinatesFromPosList.toArray(Point[]::new));
                lineString.setSrid(srid);
                PGgeometry pGgeometry = new PGgeometry(lineString);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:MultiSurface").getLength() > 0) {

                Element multiSurfaceElement = (Element) element.getElementsByTagName("gml:MultiSurface").item(0);
                Integer srid = getCrs(multiSurfaceElement);
                NodeList allLineStrings = multiSurfaceElement.getElementsByTagName("gml:LinearRing");

                List<LinearRing> linearRingList = new ArrayList<>();
                for (int i = 0; i < allLineStrings.getLength(); i++) {
                    Element linearRingElement = (Element) allLineStrings.item(i);

                    List<Point> coordinateList = getCoordinatesFromPosList(linearRingElement);

                    LinearRing linearRing = new LinearRing(coordinateList.toArray(Point[]::new));
                    linearRingList.add(linearRing);
                }
                Polygon polygon = new Polygon(linearRingList.toArray(LinearRing[]::new));
                polygon.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(polygon);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:MultiPoint").getLength() > 0) {

                Element multiPointElement = (Element) element.getElementsByTagName("gml:MultiPoint").item(0);
                Integer srid = getCrs(multiPointElement);

                Point point = getCoordinatesFromPosList(multiPointElement).get(0);
                point.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(point);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:Point").getLength() > 0) {

                Element attributeElement = (Element) element.getElementsByTagName("gml:Point").item(0);
                Integer srid = getCrs(attributeElement);

                Point point = getCoordinatesFromElement(attributeElement).get(0);
                point.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(point);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:Polygon").getLength() > 0) {
                Element polygonElement = (Element) element.getElementsByTagName("gml:Polygon").item(0);
                Integer srid = getCrs(polygonElement);
                NodeList allLineStrings = polygonElement.getElementsByTagName("gml:LinearRing");
                List<LinearRing> linearRingList = new ArrayList<>();
                for (int i = 0; i < allLineStrings.getLength(); i++) {
                    Element linearRingElement = (Element) allLineStrings.item(i);

                    List<Point> coordinateList = getCoordinatesFromElement(linearRingElement);

                    LinearRing linearRing = new LinearRing(coordinateList.toArray(Point[]::new));
                    linearRingList.add(linearRing);
                }
                Polygon polygon = new Polygon(linearRingList.toArray(LinearRing[]::new));
                polygon.setSrid(srid);

                PGgeometry pGgeometry = new PGgeometry(polygon);
                shape.setValue(pGgeometry);
            } else if (element.getElementsByTagName("gml:LineString").getLength() > 0) {
                Element attributeElement = (Element) element.getElementsByTagName("gml:LineString").item(0);
                Integer srid = getCrs(attributeElement);
                List<Point> coordinateList = getCoordinatesFromElement(attributeElement);

                LineString lineString = new LineString(coordinateList.toArray(Point[]::new));
                lineString.setSrid(srid);
                PGgeometry pGgeometry = new PGgeometry(lineString);
                shape.setValue(pGgeometry);
            }
        }
    }

    private List<Point> getCoordinatesFromElement(Element element) {
        String coordinates = element.getElementsByTagName("gml:coordinates").item(0).getTextContent();
        String[] points = coordinates.split("\\s+");
        List<Point> coordinateList = new ArrayList<>();
        for (String pointCoordinate: points) {
            String[] pointXY = pointCoordinate.split(",");
            if (pointXY.length == 2) {
                double pointX = Double.parseDouble(pointXY[0]);
                double pointY = Double.parseDouble(pointXY[1]);
                Point point = new Point(pointX, pointY);
                coordinateList.add(point);
            }
        }

        return coordinateList;
    }

    private List<Point> getCoordinatesFromPosList(Element element) {
        String coordinates = "";

        if (element.getElementsByTagName("gml:posList").getLength() > 0) {
            coordinates = element.getElementsByTagName("gml:posList").item(0).getTextContent();
        } else if (element.getElementsByTagName("gml:pos").getLength() > 0) {
            coordinates = element.getElementsByTagName("gml:pos").item(0).getTextContent();
        }

        String[] splitCoordinates = coordinates.split("\\s+");

        List<Point> coordinateList = new ArrayList<>();
        if (splitCoordinates.length % 2 == 0) {
            for (int i = 0; i < splitCoordinates.length; i = i + 2) {
                double pointX = Double.parseDouble(splitCoordinates[i]);
                double pointY = Double.parseDouble(splitCoordinates[i + 1]);
                Point point = new Point(pointX, pointY);
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
