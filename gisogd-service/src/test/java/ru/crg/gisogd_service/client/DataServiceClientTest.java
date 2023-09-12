package ru.crg.gisogd_service.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ru.crg.gisogd_service.model.crimea.common.FileRef;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@Disabled
class DataServiceClientTest {

    @Autowired
    private DataServiceClient dataServiceClient;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testDataLibrary() {
        //TODO по не воркает получение по гуйду
        Map<String, Object> dl_data_section1 = dataServiceClient.getDocByLibIdAndGuid(
                "dl_data_section1", "guid = '9d1b2f14-1eaf-4350-af7f-4aa29922fee9'");
        Map<String, Object> embedded = (Map<String, Object>) dl_data_section1.get("_embedded");
        List<Map<String, Object>> records = (List<Map<String, Object>>) embedded.get("records");
        Map<String, Object> content = (Map<String, Object>) records.get(0).get("content");
        String guid = (String) content.get("guid");
        assertEquals("9d1b2f14-1eaf-4350-af7f-4aa29922fee9", guid);
        List<FileRef> files = objectMapper.convertValue(content.get("file"), new TypeReference<>() {});
        files.get(0);
    }
}
