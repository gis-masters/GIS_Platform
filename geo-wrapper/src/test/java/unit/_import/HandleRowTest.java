package unit._import;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.postgresql.util.PGobject;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.wrapper.service.import_.DataHandler;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static ru.mycrg.wrapper.dao.DaoProperties.NULL_MARKER;

@RunWith(MockitoJUnitRunner.class)
public class HandleRowTest {

    @InjectMocks
    private DataHandler dataHandler;

    @Mock
    CrgScriptEngine scriptEngine;

    private ObjectMapper mapper = new ObjectMapper();
    private ClassLoader classLoader = getClass().getClassLoader();

    @Test
    public void shouldEncodingStrings() throws IOException, URISyntaxException {
        // PREPARE
        SchemaDto schema = getSchemaFromFile("educationSchema.json");
        Map<String, Object> dbRow = new HashMap<>() {{
            put("address", "ÐÑÐ°ÑÐ½Ð¾Ð´Ð°Ñ");
            put("name_unit", "Ð¿Ð¾Ð´ÑÐ°Ð·Ð´ÐµÐ»ÐµÐ½Ð¸Ðµ");
            put("note", "Ð½Ð¾ÑÐ¼");
        }};

        when(scriptEngine.invokeFunction(any(), any())).thenReturn(new HashMap<String, Object>());

        // ACT
        Map<String, Object> result = dataHandler.handle(dbRow, schema);

        // ASSERT
        assertNotNull(result);

        // Check encoding
        assertEquals("Краснодар", result.get("address"));
        assertEquals("подразделение", result.get("name_unit"));
        assertEquals("норм", result.get("note"));
    }

    @Test
    public void shouldConvertWrongDataToNull() throws IOException, SQLException, URISyntaxException {
        // PREPARE
        PGobject pgObject = new PGobject();
        pgObject.setValue("032165198161651981");

        LocalDateTime now = LocalDateTime.now();
        SchemaDto schema = getSchemaFromFile("educationSchema.json");
        Map<String, Object> dbRow = new HashMap<>() {{
            put("classid", "602010101");
            put("edu_stype", "0");
            put("edu_sdtype", "0");
            put("sci_type", "0");
            put("prg_type", "0");
            put("edu_tunit", "0");
            put("capacity", 0);
            put("status", "4");
            put("reg_status", "1");
            put("shape", pgObject);
            put("ruleid", "5");
            put("created_da", now);
            put("created_da2", null);
        }};

        when(scriptEngine.invokeFunction(any(), any())).thenReturn(new HashMap<String, Object>());

        // ACT
        Map<String, Object> result = dataHandler.handle(dbRow, schema);

        // ASSERT
        assertNotNull(result);

        // Check encoding
        assertEquals(NULL_MARKER, result.get("capacity"));
        assertEquals(NULL_MARKER, result.get("edu_stype"));
        assertEquals(NULL_MARKER, result.get("edu_tunit"));
        assertEquals("032165198161651981", result.get("shape").toString());
        assertEquals("4", result.get("status"));
        assertEquals("1", result.get("reg_status"));
        assertNotEquals(NULL_MARKER, result.get("created_da"));
        assertEquals(NULL_MARKER, result.get("created_da2"));
    }

    @Test
    public void shouldCorrectHandle() {
        CrgScriptEngine scriptEngine = new CrgScriptEngine();

        Map<String, Object> payload = new HashMap<>() {{
            put("record_status", null);
            put("owner_id", "2");
            put("fiz", 413);
            put("status", "CREATED");
        }};

        assertTrue((boolean) scriptEngine.invokeFunction(payload, "return obj.owner_id === '2'"));
        assertFalse((boolean) scriptEngine.invokeFunction(payload, "return obj.owner_id === '3'"));
        assertFalse((boolean) scriptEngine.invokeFunction(payload, "return obj.fiz < 100"));
        assertTrue((boolean) scriptEngine.invokeFunction(payload, "return obj.fiz == 413"));
        assertTrue((boolean) scriptEngine.invokeFunction(payload, "return obj.status === 'CREATED'"));
        assertFalse((boolean) scriptEngine.invokeFunction(payload, "return obj.status === 'NEW'"));
        assertFalse((boolean) scriptEngine.invokeFunction(payload, "return obj.record_status === 'NEW'"));
        assertTrue((boolean) scriptEngine.invokeFunction(payload, "return obj.owner_id === '2' && obj.fiz > 100"));
    }

    private SchemaDto getSchemaFromFile(String fName) throws IOException, URISyntaxException {
        File file = new File(Objects.requireNonNull(classLoader.getResource(fName)).toURI().getPath());

        return mapper.readValue(file, SchemaDto.class);
    }
}
