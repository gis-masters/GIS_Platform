package ru.mycrg.acceptance.data_service.schemas;

import ru.mycrg.acceptance.data_service.dto.schemas.SchemaDto;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.acceptance.BaseStepsDefinitions.scenarioSchemas;

public class CurrentScenarioSchema {

    public static SchemaDto getSchemaByTitle(String schemaTitle) {
        if (scenarioSchemas.isEmpty()) {
            throw new IllegalStateException(
                    "Список схем текущего сценария пуст. Выполните инициализацию схемы, используя шаги сценариев.");
        }

        SchemaDto schema = scenarioSchemas.get(schemaTitle);
        if (schema == null) {
            throw new IllegalStateException("Не найдена схема по названию: " + schemaTitle);
        }

        return schema;
    }

    public static SchemaDto getCurrentSchema() {
        Map.Entry<String, SchemaDto> someSchema = scenarioSchemas.entrySet().iterator().next();

        return getSchemaByTitle(someSchema.getKey());
    }

    public static void add(SchemaDto schema) {
        scenarioSchemas.put(schema.getTitle(), schema);
    }

    public static void clear() {
        scenarioSchemas = new HashMap<>();
    }
}
