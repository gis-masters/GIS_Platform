package ru.mycrg.data_service.mappers;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.exceptions.DataServiceException;

import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class FileResourceQualifierMapper {

    private FileResourceQualifierMapper() {
        throw new IllegalArgumentException("Utility class");
    }

    public static FileResourceQualifier mapToFileQualifier(JsonNode resourceQualifier) {
        try {
            return mapper.readValue(resourceQualifier.toString(), FileResourceQualifier.class);
        } catch (Exception e) {
            String msg = "Некорректно сформирован квалификатор ресурса";
            logError(msg, e);

            throw new DataServiceException(msg);
        }
    }
}
