package unit;

import org.geotools.referencing.CRS;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;
import ru.mycrg.data_service.DataServiceApplication;
import ru.mycrg.data_service.exceptions.TransformationException;
import ru.mycrg.data_service.util.CrsHandler;
import ru.mycrg.data_service.util.EpsgCodes;

import static org.junit.Assert.assertEquals;
import static unit.EpsgUtil.defineEpsgCodes;

public class CrsHandlerTest {

    private final EpsgCodes epsgCodes = defineEpsgCodes();
    private final CrsHandler crsHandler = new CrsHandler(epsgCodes);

    @Test
    public void defineCrsByXCoordinateFiveZone() throws FactoryException {
        //Arrange
        double xToDefine5Zone = 5184759.15;
        CoordinateReferenceSystem correctCrs = epsgCodes.getCrsBySrid(314314);

        //Act
        CoordinateReferenceSystem crsDefined = crsHandler.defineCrsByX(xToDefine5Zone);

        //Assets
        assertEquals(correctCrs, crsDefined);
    }

    @Test
    public void defineCrsByXCoordinateFourZone() throws FactoryException {
        //Arrange
        double xToDefine4Zone = 4184759.15;
        CoordinateReferenceSystem correctCrs = epsgCodes.getCrsBySrid(314315);

        //Act
        CoordinateReferenceSystem crsDefined = crsHandler.defineCrsByX(xToDefine4Zone);

        //Assets
        assertEquals(correctCrs, crsDefined);
    }

    @Test
    public void defineCrsByXCoordinateSixZone() throws FactoryException {
        //Arrange
        double xToDefine6Zone = 6184759.15;
        CoordinateReferenceSystem correctCrs = CRS.decode("EPSG: 28406");

        //Act
        CoordinateReferenceSystem crsDefined = crsHandler.defineCrsByX(xToDefine6Zone);

        //Assets
        assertEquals(correctCrs, crsDefined);
    }

    @Test
    public void defineCrsByXCoordinateIncorrect() {
        //Arrange
        double incorrectZone = 7184759.15;

        //Act
        try {
            crsHandler.defineCrsByX(incorrectZone);

            throw new AssertionError("This coordinate system shouldn't be defined");
        } catch (TransformationException exception) {
            assertEquals("Координатная система не может быть определена", exception.getMessage());
        }
    }
}
