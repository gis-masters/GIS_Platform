package ru.mycrg.gis_service.json;

 
import org.junit.jupiter.api.Test;
import ru.mycrg.gis_service.GisServiceApplication;
import ru.mycrg.gis_service.entity.Project;
import tools.jackson.databind.JsonNode;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ObjectMapperFactoryTest {

    @Test
    void shouldConvertProjectWithLocalDateTimeToJsonNode() {
        Project project = new Project();
        project.setCreatedAt(LocalDateTime.of(2026, 3, 17, 11, 22, 33));

        JsonNode jsonNode = GisServiceApplication.objectMapper.convertValue(project, JsonNode.class);

        assertEquals("2026-03-17T11:22:33", jsonNode.get("createdAt").asText());
    }
}
