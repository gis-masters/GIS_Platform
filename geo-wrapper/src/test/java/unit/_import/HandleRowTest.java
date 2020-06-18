package unit._import;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.wrapper.service.import_.DataHandler;
import ru.mycrg.wrapper.service.util.CrgScriptEngine;

import java.io.File;
import java.io.IOException;
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
    public void shouldEncodingStrings() throws IOException {
        // PREPARE
        final SchemaDto schema = getSchemaFromFile("educationSchema.json");
        final Map<String, Object> dbRow = new HashMap<String, Object>(){{
            put("address", "ÐÑÐ°ÑÐ½Ð¾Ð´Ð°Ñ");
            put("name_unit", "Ð¿Ð¾Ð´ÑÐ°Ð·Ð´ÐµÐ»ÐµÐ½Ð¸Ðµ");
            put("note", "Ð½Ð¾ÑÐ¼");
        }};

        when(scriptEngine.invokeFunction(any(), any())).thenReturn(new HashMap<String, Object>());

        // ACT
        final Map<String, Object> result = dataHandler.handle(dbRow, schema);

        // ASSERT
        assertNotNull(result);

        // Check encoding
        assertEquals("Краснодар", result.get("address"));
        assertEquals("подразделение", result.get("name_unit"));
        assertEquals("норм", result.get("note"));
    }

    @Test
    public void shouldConvertWrongDataToNull() throws IOException {
        // PREPARE
        final SchemaDto schema = getSchemaFromFile("educationSchema.json");
        final Map<String, Object> dbRow = new HashMap<String, Object>(){{
            put("classid", "602010101");
            put("edu_stype", "0");
            put("edu_sdtype", "0");
            put("sci_type", "0");
            put("prg_type", "0");
            put("edu_tunit", "0");
            put("capacity", 0);
            put("status", "4");
            put("reg_status", "1");
            put("shape", "");
            put("ruleid", "5");
        }};

        when(scriptEngine.invokeFunction(any(), any())).thenReturn(new HashMap<String, Object>());

        // ACT
        final Map<String, Object> result = dataHandler.handle(dbRow, schema);

        // ASSERT
        assertNotNull(result);

        // Check encoding
        assertEquals(NULL_MARKER, result.get("capacity"));
        assertEquals(NULL_MARKER, result.get("edu_stype"));
        assertEquals(NULL_MARKER, result.get("edu_tunit"));
        assertEquals("4", result.get("status"));
        assertEquals("1", result.get("reg_status"));
    }

    private SchemaDto getSchemaFromFile(String fName) throws IOException {
        File file = new File(Objects.requireNonNull(classLoader.getResource(fName)).getFile());

        return mapper.readValue(file, SchemaDto.class);
    }
}

//    final Map<String, Object> dbRow = new HashMap<String, Object>(){{
//        put("crg_b_geometry", "AQYAAAABAAAAAQMAAAABAAAABAAAA");
//        put("objectid", 1);
//        put("globalid", "{5555D40B-7E52-4BC9-B0DE-0838FC65E392}");
//        put("classid", "602010101");
//        put("number", "247");
//        put("name", "ÑÐ°Ð´");
//        put("oktmo", "214785");
//        put("address", "ÐÑÐ°ÑÐ½Ð¾Ð´Ð°Ñ");
//        put("name_unit", "Ð¿Ð¾Ð´ÑÐ°Ð·Ð´ÐµÐ»ÐµÐ½Ð¸Ðµ");
//        put("edu_stype", "0");
//        put("edu_sdtype", "0");
//        put("sci_type", "0");
//        put("prg_type", "0");
//        put("edu_tunit", "0");
//        put("capacity", 0);
//        put("bld_area", 214.00000000);
//        put("wrk_count", 236);
//        put("function", "");
//        put("event_time", 2040.00000000);
//        put("source", "Ð°ÐºÑ");
//        put("note", "Ð½Ð¾ÑÐ¼");
//        put("status", "4");
//        put("reg_status", "1");
//        put("shape", "");
//        put("ruleid", "5");
//        put("created_us", "D.HOSROEVA");
//        put("created_da", "2020-05-07 03:00:00+03");
//        put("last_edite", "D.HOSROEVA");
//        put("last_edi_1", "2020-05-07 03:00:00+03");
//        put("shape_leng", 2980.57521242);
//        put("shape_area", 424534.178232);
//    }};
