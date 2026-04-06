package ru.mycrg.data_service.mappers;

import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.StringNode;

import static ru.mycrg.http_client.JsonConverter.fromJson;

/**
 * Маппер для поля class_rule.
 */
public class SchemaMapper {

    private SchemaMapper() {
        throw new IllegalStateException("Utility class");
    }

    @Nullable
    public static SchemaDto jsonToDto(@Nullable String json) {
        if (json == null) {
            return null;
        }

        return fromJson(json, SchemaDto.class).orElse(null);
    }

    @Nullable
    public static SchemaDto jsonToDto(@Nullable JsonNode json) {
        if (json == null) {
            return null;
        }

        if (json instanceof StringNode) {
            return fromJson(json.asText(), SchemaDto.class).orElse(null);
        }

        return fromJson(json.toString(), SchemaDto.class).orElse(null);
    }
}
