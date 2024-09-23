package ru.mycrg.data_service.service.schemas;

import org.junit.Test;
import ru.mycrg.auth_facade.AuthenticationFacade;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SystemAttributeHandlerTest {

    private final String extensionType = "gml";

    private final SystemAttributeHandler systemAttributeHandler;

    {
        AuthenticationFacade authenticationFacade = new AuthenticationFacade();

        systemAttributeHandler = new SystemAttributeHandler(authenticationFacade);
    }

    @Test
    public void prepareCorrectFileName_fromTitleWithoutExtension() {
        IRecord record = prepareData("test", extensionType);

        String fileNameSimpleTitle = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.gml", fileNameSimpleTitle);
    }

    @Test
    public void prepareCorrectFileName_fromTitleWithExtension() {
        IRecord record = prepareData("test.gml", extensionType);

        String fileNameTitleWithExtension = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.gml", fileNameTitleWithExtension);
    }

    @Test
    public void prepareCorrectFileName_forRecordWithoutTitle() {
        IRecord record = prepareData("", extensionType);

        String fileNameBodyWithoutTitle = systemAttributeHandler.prepareFileName(record);

        assertEquals("unknown.gml", fileNameBodyWithoutTitle);
    }

    @Test
    public void prepareCorrectFileName_forRecordWithoutType() {
        IRecord record = prepareData("test", null);

        String fileNameBodyWithoutExtension = systemAttributeHandler.prepareFileName(record);

        assertEquals("test", fileNameBodyWithoutExtension);
    }

    @Test
    public void prepareCorrectFileName_fromTitleWithDoubleExtension() {
        IRecord record = prepareData("test.gml.gml", extensionType);

        String fileNameWithDoubleExtension = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.gml", fileNameWithDoubleExtension);
    }

    @Test
    public void prepareCorrectFileName_fromTitleWithSeveralPoints() {
        IRecord record = prepareData("test.12.10.2021", extensionType);

        String fileNameBodyTitleWithData = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.12.10.2021.gml", fileNameBodyTitleWithData);
    }

    @Test
    public void prepareCorrectFileName_fromTitleWithPointsAndExtension() {
        IRecord record = prepareData("test.12.13.gml", extensionType);

        String result = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.12.13.gml", result);
    }

    @Test
    public void shouldCorrectlyExtractLastIdFromPath() {
        assertEquals(5L, (long) systemAttributeHandler.getLastIdFromPath("/root/1/5").get());
        assertEquals(15597L, (long) systemAttributeHandler.getLastIdFromPath("/root/281/15597").get());
        assertEquals(11177L, (long) systemAttributeHandler.getLastIdFromPath("/root/281/4233/11177").get());
        assertEquals(1L, (long) systemAttributeHandler.getLastIdFromPath("/root/88/141/49932/1").get());
    }

    @Test
    public void lastIdShouldBeEmpty() {
        assertTrue(systemAttributeHandler.getLastIdFromPath("/root/").isEmpty());
        assertTrue(systemAttributeHandler.getLastIdFromPath("").isEmpty());
    }

    private IRecord prepareData(String title, String type) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", type);
        body.put("title", title);

        return new RecordEntity(body);
    }
}
