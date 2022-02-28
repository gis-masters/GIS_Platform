package unit;

import org.junit.Test;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.security.AuthenticationFacade;
import ru.mycrg.data_service.service.SystemAttributeHandler;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SystemAttributeHandlerTest {

    private final String extensionType = "gml";

    private final SystemAttributeHandler systemAttributeHandler = new SystemAttributeHandler(
            new AuthenticationFacade());

    @Test
    public void prepare_correct_fileName_from_title_without_extension() {
        IRecord record = prepareData("test", extensionType);

        String fileNameSimpleTitle = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.gml", fileNameSimpleTitle);
    }

    @Test
    public void Prepare_correct_fileName_from_title_with_extension() {
        IRecord record = prepareData("test.gml", extensionType);

        String fileNameTitleWithExtension = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.gml", fileNameTitleWithExtension);
    }

    @Test
    public void Prepare_correct_fileName_without_title() {
        IRecord record = prepareData("", extensionType);

        String fileNameBodyWithoutTitle = systemAttributeHandler.prepareFileName(record);

        assertEquals("unknown.gml", fileNameBodyWithoutTitle);
    }

    @Test
    public void Prepare_correct_fileName_without_type() {
        IRecord record = prepareData("test", null);

        String fileNameBodyWithoutExtension = systemAttributeHandler.prepareFileName(record);

        assertEquals("test", fileNameBodyWithoutExtension);
    }

    @Test
    public void Prepare_correct_fileName_from_title_with_double_extension() {
        IRecord record = prepareData("test.gml.gml", extensionType);

        String fileNameWithDoubleExtension = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.gml", fileNameWithDoubleExtension);
    }

    @Test
    public void Prepare_correct_fileName_from_title_with_several_points() {
        IRecord record = prepareData("test.12.10.2021", extensionType);

        String fileNameBodyTitleWithData = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.12.10.2021.gml", fileNameBodyTitleWithData);
    }

    @Test
    public void Prepare_correct_fileName_from_title_with_points_and_extension() {
        IRecord record = prepareData("test.12.13.gml", extensionType);

        String result = systemAttributeHandler.prepareFileName(record);

        assertEquals("test.12.13.gml", result);
    }

    private IRecord prepareData(String title, String type) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", type);
        body.put("title", title);

        return new RecordEntity(body);
    }
}
