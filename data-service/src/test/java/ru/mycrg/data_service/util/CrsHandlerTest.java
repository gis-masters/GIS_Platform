package ru.mycrg.data_service.util;

import org.geotools.referencing.CRS;
import org.junit.Test;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.TransformationException;
import ru.mycrg.data_service.service.parsers.exceptions.EpsgParserException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

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

    // Позитивные тесты
    @Test
    public void shouldExtractCorrectNumber_lowercasePrefix() {
        assertEquals(7829, CrsHandler.extractCrsNumber("epsg:7829").intValue());
    }

    @Test
    public void shouldExtractCorrectNumber_uppercasePrefix() {
        assertEquals(4326, CrsHandler.extractCrsNumber("EPSG:4326").intValue());
    }

    @Test
    public void shouldExtractCorrectNumber_withSpacesAround() {
        assertEquals(9999, CrsHandler.extractCrsNumber("  EPSG:9999  ").intValue());
    }

    @Test
    public void shouldExtractMaxIntegerValue() {
        assertEquals(Integer.MAX_VALUE, CrsHandler.extractCrsNumber("EPSG:" + Integer.MAX_VALUE).intValue());
    }

    @Test
    public void shouldExtractZeroValue() {
        assertEquals(0, CrsHandler.extractCrsNumber("EPSG:0").intValue());
    }

    @Test
    public void shouldExtractFromUrnFormat() {
        assertEquals(3857, CrsHandler.extractCrsNumber("urn:ogc:def:crs:EPSG:3857").intValue());
    }

    @Test
    public void shouldExtractFromUrnFormatWithTrailingSlash() {
        assertEquals(3857, CrsHandler.extractCrsNumber("urn:ogc:def:crs:EPSG:3857/").intValue());
    }

    @Test
    public void shouldExtractFromRandomFormat() {
        assertEquals(28406, CrsHandler.extractCrsNumber("fignya napisana:EPSG:28406").intValue());
    }

    // Негативные тесты
    @Test(expected = DataServiceException.class)
    public void shouldThrowExceptionForNullInput() {
        CrsHandler.extractCrsNumber(null);
    }

    @Test(expected = DataServiceException.class)
    public void shouldThrowExceptionForEmptyString() {
        CrsHandler.extractCrsNumber("");
    }

    @Test(expected = DataServiceException.class)
    public void shouldThrowExceptionForBlankString() {
        CrsHandler.extractCrsNumber("   ");
    }

    @Test(expected = EpsgParserException.class)
    public void shouldThrowExceptionForMissingEpsgPrefix() {
        CrsHandler.extractCrsNumber("12345");
    }

    @Test(expected = EpsgParserException.class)
    public void shouldThrowExceptionForInvalidFormat_onlyPrefix() {
        CrsHandler.extractCrsNumber("EPSG:");
    }

    @Test(expected = EpsgParserException.class)
    public void shouldThrowExceptionForLettersAfterPrefix() {
        CrsHandler.extractCrsNumber("EPSG:ABC");
    }

    @Test(expected = EpsgParserException.class)
    public void shouldThrowExceptionForMixedChars() {
        CrsHandler.extractCrsNumber("EPSG:123a");
    }

    @Test(expected = EpsgParserException.class)
    public void shouldThrowExceptionForSpacesInNumber() {
        CrsHandler.extractCrsNumber("EPSG:123 456");
    }

    @Test(expected = EpsgParserException.class)
    public void shouldThrowExceptionForSpecialChars() {
        CrsHandler.extractCrsNumber("EPSG:123-456");
    }

    @Test(expected = DataServiceException.class)
    public void shouldThrowExceptionForNumberTooLarge() {
        CrsHandler.extractCrsNumber("EPSG:2147483648"); // MAX_VALUE + 1
    }

    // Тесты сообщений об ошибках
    @Test
    public void shouldContainOriginalStringInErrorMessage() {
        try {
            CrsHandler.extractCrsNumber("INVALID:123");

            fail("Ожидалось EpsgParserException");
        } catch (EpsgParserException e) {
            assertTrue("Сообщение об ошибке должно содержать оригинальную строку",
                       e.getMessage().contains("INVALID:123"));
        }
    }

    @Test
    public void shouldHaveCorrectMessageForNonDigits() {
        try {
            CrsHandler.extractCrsNumber("EPSG:12AB34");
            fail("Ожидалось EpsgParserException");
        } catch (EpsgParserException e) {
            assertTrue("Сообщение должно указывать на недопустимые символы",
                       e.getMessage().contains("должны быть только цифры"));
        }
    }
}
