package unit;

import org.junit.Test;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.security.AuthenticationFacade;
import ru.mycrg.data_service.service.SystemAttributeHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SystemAttributeHandlerTest {

    private final String extensionType = "gml";

    private final SystemAttributeHandler systemAttributeHandler = new SystemAttributeHandler(
            new AuthenticationFacade());

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
        Optional<Long> lastId = systemAttributeHandler.getLastIdFromPath("/root/1/5");

        assertTrue(lastId.isPresent());
        assertEquals(5L, (long) lastId.get());
    }

    @Test
    public void lastIdShouldBeEmpty_forRootPath() {
        Optional<Long> lastId = systemAttributeHandler.getLastIdFromPath("/root/");

        assertTrue(lastId.isEmpty());
    }

    private IRecord prepareData(String title, String type) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", type);
        body.put("title", title);

        return new RecordEntity(body);
    }
}
