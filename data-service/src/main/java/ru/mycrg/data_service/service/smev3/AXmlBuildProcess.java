package ru.mycrg.data_service.service.smev3;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.fields.FieldsFiles;
import ru.mycrg.data_service.service.schemas.SchemaService;
import ru.mycrg.data_service.service.resources.ResourceJsonCondition;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.smev3.model.RecordData;
import ru.mycrg.data_service.service.smev3.model.RefType;
import ru.mycrg.data_service.service.smev3.model.SmevAttachment;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Optional.of;
import static java.util.Optional.ofNullable;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATETIME_PATTERN;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.util.JsonConverter.fromJson;

public abstract class AXmlBuildProcess {

    protected final BaseDao baseDao;
    protected final SchemaService schemaService;

    protected final Map<RecordData, IRecord> sourceRecords = new HashMap<>();
    protected final Map<String, SchemaDto> schemasMap = new HashMap<>();
    protected final Map<String, SmevAttachment> attachments = new HashMap<>();

    public AXmlBuildProcess(BaseDao baseDao, SchemaService schemaService) {
        this.baseDao = baseDao;
        this.schemaService = schemaService;
    }

    protected Optional<Boolean> asBoolean(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(Boolean::parseBoolean);
    }

    protected Optional<String> asString(IRecord record, String fieldName) {
        return ofNullable(record.getAsString(fieldName)).map(String::trim);
    }

    protected Optional<Long> asLong(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(Long::parseLong);
    }

    protected Optional<Integer> asInt(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(Integer::parseInt);
    }

    protected Optional<LocalDateTime> asLocalDateTime(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(s -> LocalDateTime.parse(s, DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN)));
    }

    protected Optional<LocalDate> asLocalDate(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(LocalDate::parse);
    }

    protected Optional<RefType> asRefType(IRecord record, String tableName, String fieldName) {
        return asString(record, fieldName)
                .map(value -> refType(tableName, fieldName, value));
    }

    protected Optional<IRecord> asRefRecord(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(jsonString -> {
                    var jsonNode = of(jsonString)
                            .map(JsonConverter::toJsonNodeFromString)
                            .map(JsonNode::iterator)
                            .map(Iterator::next)
                            .get();
                    var table = jsonNode.get("libraryTableName").asText();
                    var id = jsonNode.get("id").asLong();
                    return getRecordById(LIBRARY_RECORD, SYSTEM_SCHEMA_NAME, table, table, id);
                });
    }

    protected Optional<List<IRecord>> asFileRecord(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .flatMap(jsonString -> fromJson(jsonString, new TypeReference<List<FileDescription>>() {
                        })
                )
                .map(object -> (List<FileDescription>) object)
                .map(fileDescriptions -> fileDescriptions
                        .stream()
                        .map(fileDescription -> getRecordById(
                                LIBRARY_RECORD,
                                SYSTEM_SCHEMA_NAME,
                                null,
                                FieldsFiles.TABLE,
                                fileDescription.getId()
                        ))
                        .collect(Collectors.toList())
                );
    }

    protected IRecord getRecordById(ResourceType resourceType,
                                    String workspace,
                                    String schemaId,
                                    String libId,
                                    Object recordId) {
        try {
            var recordData = new RecordData(libId, recordId);
            if (!sourceRecords.containsKey(recordData)) {
                var schemaDto = ofNullable(schemaId)
                        .flatMap(this::getSchema)
                        .orElse(null);
                var record = baseDao.getById(
                        new ResourceQualifier(
                                workspace,
                                libId,
                                recordId,
                                resourceType
                        ),
                        schemaDto
                );
                sourceRecords.put(recordData, record);
            }
            return sourceRecords.get(recordData);
        } catch (CrgDaoException e) {
            throw SmevRequestException.crgDaoException(e);
        }
    }

    protected IRecord getRecordByJsonIdValue(ResourceType resourceType,
                                             String workspace,
                                             String schemaId,
                                             String libId,
                                             String jsonFieldName,
                                             Long jsonIdValue) {
        var record = getSchema(schemaId)
                .flatMap(schemaDto -> baseDao.findByJson(
                        ResourceJsonCondition.byJsonIdValue(
                                workspace,
                                libId,
                                jsonFieldName,
                                jsonIdValue,
                                resourceType
                        ),
                        schemaDto
                ))
                .orElseThrow(() -> SmevRequestException.recordNotFound(schemaId, libId));
        var recordData = new RecordData(libId, record.getId());
        if (!sourceRecords.containsKey(recordData)) {
            sourceRecords.put(recordData, record);
        }
        return sourceRecords.get(recordData);
    }

    protected RefType refType(String tableName, String field, String strValue) {
        return getSchema(tableName)
                .map(SchemaDto::getProperties)
                .map(Collection::stream)
                .flatMap(stream -> stream.filter(dto -> dto.getName().equals(field)).findFirst())
                .map(SimplePropertyDto::getEnumerations)
                .map(Collection::stream)
                .flatMap(stream -> stream.filter(dto -> dto.getValue().equals(strValue)).findFirst())
                .map(valueTitle -> new RefType(valueTitle.getValue(), valueTitle.getTitle()))
                .orElseThrow(() -> SmevRequestException.refValueNotFound(tableName, field, strValue));
    }

    protected Optional<SchemaDto> getSchema(String schemaName) {
        if (!schemasMap.containsKey(schemaName)) {
            schemaService.getSchemaByName(schemaName).ifPresent(schemaDto -> schemasMap.put(schemaName, schemaDto));
        }
        return ofNullable(schemasMap.get(schemaName));
    }
}
