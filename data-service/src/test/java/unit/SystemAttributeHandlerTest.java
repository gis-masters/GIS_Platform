package unit;

import org.junit.Test;
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
        Map<String, Object> data = prepareData("test", extensionType);

        String fileNameSimpleTitle = systemAttributeHandler.prepareFileName(data);

        assertEquals("test.gml", fileNameSimpleTitle);
    }

    @Test
    public void Prepare_correct_fileName_from_title_with_extension() {
        Map<String, Object> data = prepareData("test.gml", extensionType);

        String fileNameTitleWithExtension = systemAttributeHandler.prepareFileName(data);

        assertEquals("test.gml", fileNameTitleWithExtension);
    }

    @Test
    public void Prepare_correct_fileName_without_title() {
        Map<String, Object> data = prepareData("", extensionType);

        String fileNameBodyWithoutTitle = systemAttributeHandler.prepareFileName(data);

        assertEquals("unknown.gml", fileNameBodyWithoutTitle);
    }

    @Test
    public void Prepare_correct_fileName_without_type() {
        Map<String, Object> data = prepareData("test", null);

        String fileNameBodyWithoutExtension = systemAttributeHandler.prepareFileName(data);

        assertEquals("test", fileNameBodyWithoutExtension);
    }

    @Test
    public void Prepare_correct_fileName_from_title_with_double_extension() {
        Map<String, Object> data = prepareData("test.gml.gml", extensionType);

        String fileNameWithDoubleExtension = systemAttributeHandler.prepareFileName(data);

        assertEquals("test.gml", fileNameWithDoubleExtension);
    }

    @Test
    public void Prepare_correct_fileName_from_title_with_several_points() {
        Map<String, Object> data = prepareData("test.12.10.2021", extensionType);

        String fileNameBodyTitleWithData = systemAttributeHandler.prepareFileName(data);

        assertEquals("test.12.10.2021.gml", fileNameBodyTitleWithData);
    }

    @Test
    public void Prepare_correct_fileName_from_title_with_points_and_extension() {
        Map<String, Object> data = prepareData("test.12.13.gml", extensionType);

        String result = systemAttributeHandler.prepareFileName(data);

        assertEquals("test.12.13.gml", result);
    }

    private Map<String, Object> prepareData(String title, String type) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", type);
        body.put("title", title);

        return body;
    }
}
