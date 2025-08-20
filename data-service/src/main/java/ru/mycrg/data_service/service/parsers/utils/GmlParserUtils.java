package ru.mycrg.data_service.service.parsers.utils;

import org.postgis.LinearRing;
import org.postgis.Point;
import org.postgis.Polygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.parsers.exceptions.GmlParserException;

import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service_contract.enums.GeometryType.*;

public class GmlParserUtils {

    private static final Logger log = LoggerFactory.getLogger(GmlParserUtils.class);

    private GmlParserUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static List<Point> getCoordinatesFromElement(Element element, boolean invertCoordinates) {
        NodeList coordinateElement = element.getElementsByTagName("gml:coordinates");
        List<Point> coordinateList = new ArrayList<>();
        if (coordinateElement.getLength() > 0) {
            String coordinates = coordinateElement.item(0).getTextContent();
            coordinates = coordinates.trim();
            String[] points = coordinates.split("\\s+");
            for (String pointCoordinate: points) {
                String[] pointXY = pointCoordinate.split(",");
                if (pointXY.length == 2) {
                    double pointX = Double.parseDouble(pointXY[0]);
                    double pointY = Double.parseDouble(pointXY[1]);
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

    public static List<Point> getCoordinatesFromPosList(Element element, int posListNumber,
                                                        boolean invertCoordinates) {
        String coordinates = "";

        if (element.getElementsByTagName("gml:posList").getLength() > 0) {
            coordinates = element.getElementsByTagName("gml:posList").item(posListNumber).getTextContent();
        } else if (element.getElementsByTagName("gml:pos").getLength() > 0) {
            return getPointsFromPos(element, invertCoordinates);
        }
        coordinates = coordinates.trim();
        String[] splitCoordinates = coordinates.split("\\s+");

        List<Point> coordinateList = new ArrayList<>();
        if (splitCoordinates.length % 2 == 0) {
            for (int i = 0; i < splitCoordinates.length; i = i + 2) {
                double pointX = Double.parseDouble(splitCoordinates[i]);
                double pointY = Double.parseDouble(splitCoordinates[i + 1]);
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

    public static List<Point> getPointsFromPos(Element element, boolean invertCoordinates) {
        List<Point> coordinateList = new ArrayList<>();

        for (int i = 0; i < element.getElementsByTagName("gml:pos").getLength(); i++) {
            String coordinates = element.getElementsByTagName("gml:pos").item(i).getTextContent();
            coordinates = coordinates.trim();
            String[] splitCoordinates = coordinates.split("\\s+");
            if (splitCoordinates.length == 2) {
                double pointX = Double.parseDouble(splitCoordinates[0]);
                double pointY = Double.parseDouble(splitCoordinates[1]);
                Point point = invertCoordinates
                        ? new Point(pointY, pointX)
                        : new Point(pointX, pointY);
                coordinateList.add(point);
            }
        }

        return coordinateList;
    }

    public static Integer getCrs(String defaultEpsg, Element attributeElement) {
        return attributeElement.getAttribute("srsName").isEmpty()
                ? extractCrsNumber(defaultEpsg)
                : extractCrsNumber(attributeElement.getAttribute("srsName"));
    }

    public static Polygon makePolygonFromRing(boolean invertCoordinates, Element rootElement) {
        NodeList allLinearRings = rootElement.getElementsByTagName("gml:LinearRing");
        List<LinearRing> linearRingsByPolygon = new ArrayList<>();
        for (int j = 0; j < allLinearRings.getLength(); j++) {
            Element linearRingElement = (Element) allLinearRings.item(j);

            List<Point> coordinateList = getCoordinatesFromElement(linearRingElement, invertCoordinates);

            LinearRing linearRing = new LinearRing(coordinateList.toArray(Point[]::new));
            linearRingsByPolygon.add(linearRing);
        }

        return new Polygon(linearRingsByPolygon.toArray(LinearRing[]::new));
    }

    public static String getGeometryType(Element element) {
        if (element.getElementsByTagName("gml:GeometryCollection").getLength() > 0) {
            return GEOMETRY_COLLECTION.getType();
        } else if (element.getElementsByTagName("gml:MultiCurve").getLength() > 0) {
            return MULTI_CURVE.getType();
        } else if (element.getElementsByTagName("gml:MultiSurface").getLength() > 0) {
            return MULTI_SURFACE.getType();
        } else if (element.getElementsByTagName("gml:MultiPoint").getLength() > 0) {
            return MULTI_POINT.getType();
        } else if (element.getElementsByTagName("gml:Point").getLength() > 0) {
            return POINT.getType();
        } else if (element.getElementsByTagName("gml:MultiPolygon").getLength() > 0) {
            return MULTI_POLYGON.getType();
        } else if (element.getElementsByTagName("gml:Polygon").getLength() > 0) {
            return POLYGON.getType();
        } else if (element.getElementsByTagName("gml:Surface").getLength() > 0) {
            return SURFACE.getType();
        } else if (element.getElementsByTagName("gml:MultiLineString").getLength() > 0) {
            return MULTI_LINE_STRING.getType();
        } else if (element.getElementsByTagName("gml:LineString").getLength() > 0) {
            return LINE_STRING.getType();
        } else if (element.getElementsByTagName("gml:Curve").getLength() > 0) {
            return CURVE.getType();
        } else {
            String msg = "Не удалось распознать тип геометрии: " + element.getTextContent();
            log.error(msg);

            return "";
        }
    }
}
