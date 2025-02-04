package ru.mycrg.data_service.util;

import org.geotools.referencing.CRS;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.postgis.Point;
import org.springframework.util.StopWatch;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Thread.sleep;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TransformationGeometryTest {

    private final EpsgCodes epsgCodes = new EpsgCodes();
    private final TransformationGeometryUtils transformationGeometryUtils = new TransformationGeometryUtils();
    private final List<Polygon> polygons = new ArrayList<>();
    private final GeometryFactory geometryFactory = new GeometryFactory();
    private Geometry geometry = null;
    private CoordinateReferenceSystem crs5Zone;
    private CoordinateReferenceSystem crs4Zone;
    private CoordinateReferenceSystem crs6Zone;

    @Before
    public void createPolygonList() throws FactoryException {
        // Arrange
        // this coordinatesForFirstPolygon have 5 zone crs
        Coordinate coordinate1 = new Coordinate(5184759.15, 4973083.82);
        Coordinate coordinate2 = new Coordinate(5184740.29, 4973068.73);
        Coordinate coordinate3 = new Coordinate(5184725.06, 4973068.71);
        Coordinate coordinate4 = new Coordinate(5184724.87, 4973083.51);
        Coordinate coordinate5 = new Coordinate(5184724.87, 4973083.84);
        Coordinate coordinate6 = new Coordinate(5184759.15, 4973083.82);

        Coordinate coordinate7 = new Coordinate(5184824.29, 4973083.78);
        Coordinate coordinate8 = new Coordinate(5184824.20, 4973068.85);
        Coordinate coordinate9 = new Coordinate(5184796.42, 4973068.81);
        Coordinate coordinate10 = new Coordinate(5184815.13, 4973083.79);
        Coordinate coordinate11 = new Coordinate(5184824.29, 4973083.78);

        Coordinate[] coordinatesForFirstPolygon = {coordinate1, coordinate2, coordinate3, coordinate4, coordinate5, coordinate6};
        Coordinate[] coordinatesForSecondPolygon = {coordinate7, coordinate8, coordinate9, coordinate10, coordinate11};

        Polygon polygonFirst = geometryFactory.createPolygon(coordinatesForFirstPolygon);
        Polygon polygonSecond = geometryFactory.createPolygon(coordinatesForSecondPolygon);

        polygons.add(polygonFirst);
        polygons.add(polygonSecond);
        geometry = geometryFactory.createMultiPolygon(polygons.toArray(org.locationtech.jts.geom.Polygon[]::new));
        crs5Zone = epsgCodes.getCrsBySrid(314314);
        crs4Zone = epsgCodes.getCrsBySrid(314315);
        crs6Zone = CRS.decode("EPSG: 28406");
    }

    @After
    public void deletePolygonList() {
        polygons.clear();
    }

    @Test
    public void transformationGeometryFrom5ZoneTo6Zone() {
        // Act
        // check transformation to 6 zone
        List<Coordinate> coordinatesSixZone = List.of(
                transformationGeometryUtils.transform(geometry, crs5Zone, crs6Zone));

        // Assert
        //check that all coordinates is presents
        assertEquals(geometry.getCoordinates().length, coordinatesSixZone.size());

        // check that zone of transformed polygon is zone 6
        coordinatesSixZone.forEach(coordinate -> assertTrue(coordinate.x / 100000 >= 60 && coordinate.x / 100000 < 70));
    }

    @Test
    public void transformationGeometryFrom5ZoneTo4Zone() {
        // Act
        List<Coordinate> coordinatesFourZone = List.of(
                transformationGeometryUtils.transform(geometry, crs5Zone, crs4Zone));

        // Assert
        //check that all coordinates is presents
        assertEquals(geometry.getCoordinates().length, coordinatesFourZone.size());

        // check that zone of transformed polygon is zone 6
        coordinatesFourZone.forEach(
                coordinate -> assertTrue(coordinate.x / 100000 >= 40 && coordinate.x / 100000 < 50));
    }

    @Test
    public void transformationGeometryWhenZoneIsSameWithLayerZone() {
        // Act
        List<Coordinate> coordinatesFiveZone = List.of(
                transformationGeometryUtils.transform(geometry, crs5Zone, crs5Zone));

        // Assert
        //check that all coordinates is presents
        assertEquals(geometry.getCoordinates().length, coordinatesFiveZone.size());

        // check that zone of prepared polygon is zone 5
        for (int i = 0; i < coordinatesFiveZone.size(); i++) {
            assertEquals(geometry.getCoordinates()[i].x, coordinatesFiveZone.get(i).x, 0);
            assertEquals(geometry.getCoordinates()[i].y, coordinatesFiveZone.get(i).y, 0);
        }
    }

    @Test
    public void convertCoordinatesToCorrectGeometryType() {
        // Act
        List<org.postgis.Polygon> preparedPolygons =
                transformationGeometryUtils.convertPolygonListToCorrectGeometryType(polygons);

        // Assert
        //check that all coordinates is presents
        assertEquals(polygons.size(), preparedPolygons.size());

        // check that zone of prepared polygon is zone 5
        for (int i = 0; i < preparedPolygons.size(); i++) {
            Coordinate[] coordinates = polygons.get(i).getCoordinates();
            Point[] preparedPoints = preparedPolygons.get(i).getRing(0).getPoints();
            assertEquals(coordinates.length, preparedPoints.length);
            for (int j = 0; j < coordinates.length; j++) {
                assertEquals(coordinates[j].x, preparedPoints[j].x, 0);
                assertEquals(coordinates[j].y, preparedPoints[j].y, 0);
            }
        }
    }

    @Test
    public void watcherExample() throws InterruptedException {
        Map<String, Long> resultLog = new HashMap<>();

        // First
        Map<String, Long> watchLog = new HashMap<>();
        StopWatch watcher = new StopWatch("Публикация");
        watcher.start("Маппинг полей");
        sleep(76);
        watcher.stop();
        watchLog.put(watcher.getLastTaskName(), watcher.getLastTaskTimeMillis());

        watcher.start("Сбор детей");
        sleep(226);
        watcher.stop();
        watchLog.put(watcher.getLastTaskName(), watcher.getLastTaskTimeMillis());

        watcher.start("JSON сериализация");
        sleep(12);
        watcher.stop();
        watchLog.put(watcher.getLastTaskName(), watcher.getLastTaskTimeMillis());

        System.out.println(watcher.prettyPrint());
        System.out.println(watchLog);

        watchLog.forEach((k, v) -> {
            Long resultTime = resultLog.getOrDefault(k, 0L);

            resultLog.put(k, resultTime + v);
        });


        // Second
        Map<String, Long> watchLog2 = new HashMap<>();
        StopWatch watcher2 = new StopWatch("Публикация");
        watcher2.start("Маппинг полей");
        sleep(76);
        watcher2.stop();
        watchLog2.put(watcher2.getLastTaskName(), watcher2.getLastTaskTimeMillis());

        watcher2.start("Сбор детей");
        sleep(226);
        watcher2.stop();
        watchLog2.put(watcher2.getLastTaskName(), watcher2.getLastTaskTimeMillis());

        watcher2.start("JSON сериализация");
        sleep(12);
        watcher2.stop();
        watchLog2.put(watcher2.getLastTaskName(), watcher2.getLastTaskTimeMillis());

        System.out.println(watcher2.prettyPrint());
        System.out.println(watchLog2);

        watchLog2.forEach((k, v) -> {
            Long resultTime = resultLog.getOrDefault(k, 0L);

            resultLog.put(k, resultTime + v);
        });
        System.out.println(resultLog);
    }
}
