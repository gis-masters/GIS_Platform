package ru.mycrg.data_service.util;

import org.geotools.referencing.CRS;
import org.junit.Test;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import ru.mycrg.data_service.exceptions.TransformationException;

import static org.junit.Assert.assertEquals;

public class CrsHandlerTest {

    private final EpsgCodes epsgCodes = new EpsgCodes();

    @Test
    public void defineCrsByXCoordinateFiveZone() throws FactoryException {
        //Arrange
        double xToDefine5Zone = 5184759.15;
        CoordinateReferenceSystem correctCrs = epsgCodes.getCrsBySrid(314314);

        //Act
        CoordinateReferenceSystem crsDefined = CrsHandler.defineCrsByX(xToDefine5Zone);

        //Assets
        assertEquals(correctCrs, crsDefined);
    }

    @Test
    public void defineCrsByXCoordinateFourZone() throws FactoryException {
        //Arrange
        double xToDefine4Zone = 4184759.15;
        CoordinateReferenceSystem correctCrs = epsgCodes.getCrsBySrid(314315);

        //Act
        CoordinateReferenceSystem crsDefined = CrsHandler.defineCrsByX(xToDefine4Zone);

        //Assets
        assertEquals(correctCrs, crsDefined);
    }

    @Test
    public void defineCrsByXCoordinateSixZone() throws FactoryException {
        //Arrange
        double xToDefine6Zone = 6184759.15;
        CoordinateReferenceSystem correctCrs = CRS.decode("EPSG: 28406");

        //Act
        CoordinateReferenceSystem crsDefined = CrsHandler.defineCrsByX(xToDefine6Zone);

        //Assets
        assertEquals(correctCrs, crsDefined);
    }

    @Test
    public void defineCrsByXCoordinateIncorrect() {
        //Arrange
        double incorrectZone = 7184759.15;

        //Act
        try {
            CrsHandler.defineCrsByX(incorrectZone);

            throw new AssertionError("This coordinate system shouldn't be defined");
        } catch (TransformationException exception) {
            assertEquals("Координатная система не может быть определена", exception.getMessage());
        }
    }
}
