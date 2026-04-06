package ru.mycrg.data_service.mappers;

import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.exceptions.DataServiceException;
import tools.jackson.databind.JsonNode;

import static ru.mycrg.http_client.JsonConverter.fromJson;

public class FileResourceQualifierMapper {

    private static final String INVALID_RESOURCE_QUALIFIER = "Некорректно сформирован квалификатор ресурса";

    private FileResourceQualifierMapper() {
        throw new IllegalStateException("Utility class");
    }

    public static FileResourceQualifier mapToFileQualifier(JsonNode resourceQualifier) {
        if (resourceQualifier == null) {
            throw new DataServiceException(INVALID_RESOURCE_QUALIFIER);
        }

        return fromJson(resourceQualifier.toString(), FileResourceQualifier.class)
                .orElseThrow(() -> new DataServiceException(INVALID_RESOURCE_QUALIFIER));
    }
}

