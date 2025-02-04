package ru.mycrg.data_service.service.files;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.FileType;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.join;
import static ru.mycrg.common_utils.CrgGlobalProperties.joinByDouble;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.ValueType.FILE;

public class FileUtil {

    private static final Logger log = LoggerFactory.getLogger(FileUtil.class);

    private FileUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static List<UUID> getFilesIdFromField(Map<String, Object> record, String fileFieldName) {
        return getFilesDescription(record, fileFieldName)
                .stream()
                .map(FileDescription::getId)
                .collect(Collectors.toList());
    }

    public static FileType defineType(File file) {
        try {
            String extension = file.getExtension().toUpperCase();

            return FileType.valueOf(extension);
        } catch (Exception e) {
            String msg = String.format("Не удалось определить тип файла: '%s'", file);
            log.error(msg);

            throw new BadRequestException(msg);
        }
    }

    public static String makeFileName(ResourceQualifier qualifier, String fileHashCode) {
        String recordId = "undefinedRecordId";
        if (qualifier.getRecordId() == null) {
            log.warn("Не установлен recordId у квалификатора ресурса: [{}]", qualifier);
        } else {
            recordId = qualifier.getRecordId().toString();
        }

        String fieldName = "undefinedFieldName";
        if (qualifier.getField() == null) {
            log.warn("Не установлено fieldName у квалификатора ресурса: [{}]", qualifier.getQualifier());
        } else {
            fieldName = qualifier.getField();
        }

        return joinByDouble(join(recordId, fieldName), fileHashCode);
    }

    public static List<FileDescription> getFilesDescription(Map<String, Object> record, String fieldName) {
        Object payload = record.get(fieldName);
        if (payload != null) {
            try {
                return mapper.readValue(payload.toString(),
                                        new TypeReference<List<FileDescription>>() {
                                        });
            } catch (IOException e) {
                String msg = "Содержимое поля типа FILE имеет не корректное тело: " + payload;
                logError(msg, e);

                return new ArrayList<>();
            }
        } else {
            return new ArrayList<>();
        }
    }

    @NotNull
    public static List<String> getFileFieldNames(SchemaDto schema) {
        return schema.getProperties().stream()
                     .filter(property -> property.getValueTypeAsEnum().equals(FILE))
                     .map(SimplePropertyDto::getName)
                     .collect(Collectors.toList());
    }

    public static byte[] getFileAsBytes(File file) {
        byte[] result;
        try {
            result = Files.readAllBytes(Path.of(file.getPath()));
        } catch (IOException e) {
            String msg = "Не удалось прочитать файл: " + file.getId();

            log.error("{} => {}", msg, e.getMessage(), e);

            throw new DataServiceException(msg);
        }

        if (result.length > 0) {
            return result;
        } else {
            throw new DataServiceException("Файл пуст: " + file.getId());
        }
    }
}
