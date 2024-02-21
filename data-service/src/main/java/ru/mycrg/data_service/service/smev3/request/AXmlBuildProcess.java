package ru.mycrg.data_service.service.smev3.request;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.fields.FieldsFiles;
import ru.mycrg.data_service.service.resources.ResourceJsonCondition;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.model.RecordData;
import ru.mycrg.data_service.service.smev3.model.RefType;
import ru.mycrg.data_service.service.smev3.model.SmevAttachment;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMapper;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import javax.xml.datatype.XMLGregorianCalendar;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATETIME_PATTERN;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.util.JsonConverter.fromJson;

public abstract class AXmlBuildProcess {
    protected final RequestProcessor requestProcessor;
    protected final Map<String, SchemaDto> schemasMap = new HashMap<>();
    protected final Map<RecordData, IRecord> sourceRecordsMap = new HashMap<>();
    protected final Map<String, SmevAttachment> attachmentsMap = new HashMap<>();

    public AXmlBuildProcess(RequestProcessor requestProcessor) {
        this.requestProcessor = requestProcessor;
    }

    protected <T> BuildRequestAndSources<T> buildRequest(T request) {
        return new BuildRequestAndSources<>(
                request,
                this.sourceRecordsMap,
                this.attachmentsMap
        );
    }

    public Optional<String> ofNullableString(String value) {
        return ofNullable(value).map(s -> StringUtils.isNotEmpty(s) ? s : null);
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

    protected Optional<Double> asDouble(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(Double::parseDouble);
    }

    protected Optional<BigInteger> asBigInteger(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(BigInteger::new);
    }

    protected Optional<LocalDateTime> asLocalDateTime(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(s -> LocalDateTime.parse(s, DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN)));
    }

    protected Optional<XMLGregorianCalendar> asXMLGregorianCalendar(IRecord record, String fieldName) {
        return asLocalDateTime(record, fieldName)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar);
    }

    protected Optional<LocalDate> asLocalDate(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(LocalDate::parse);
    }

    protected Optional<RefType> asRefType(IRecord record, String tableName, String fieldName) {
        return asString(record, fieldName)
                .map(value -> refType(tableName, fieldName, value));
    }

    protected Optional<IRecord> asRefRecord(@NotNull IRecord record, @NotNull String fieldName) {
        return asString(record, fieldName)
                .map(JsonConverter::toJsonNodeFromString)
                .map(JsonNode::iterator)
                .map(Iterator::next)
                .map(jsonNode -> {
                    var table = jsonNode.get("libraryTableName").asText();
                    var id = jsonNode.get("id").asLong();
                    return getRecordById(LIBRARY_RECORD, SYSTEM_SCHEMA_NAME, table, table, id);
                });
    }

    protected List<IRecord> asFileRecord(IRecord record, String fieldName) {
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
                )
                .orElse(List.of());
    }

    //TODO с атачментами пока не понятно как должно быть. Оставить так, до успешного  внедрения
    protected List<SmevAttachment> asAttachment(IRecord record, String fieldName) {
        return asFileRecord(record, fieldName)
                .stream()
                .map(fileRecord -> {
                    var fileId = fileRecord.getAsString(FieldsFiles.PROPERTY_ID);
                    if (!attachmentsMap.containsKey(fileId)) {
                        var smevAttachment = attachmentService().pushAttachment(fileRecord);
                        attachmentsMap.put(smevAttachment.getFileId(), smevAttachment);
                    }
                    return attachmentsMap.get(fileId);
                })
                .collect(Collectors.toList());
    }

    protected IRecord getRecordById(ResourceType resourceType,
                                    String workspace,
                                    String schemaId,
                                    String libId,
                                    Object recordId) {
        try {
            var recordData = RecordData.byId(libId, recordId);
            if (!sourceRecordsMap.containsKey(recordData)) {
                var schemaDto = ofNullable(schemaId)
                        .flatMap(this::getSchema)
                        .orElse(null);
                var record = baseDao().getById(
                        new ResourceQualifier(
                                workspace,
                                libId,
                                recordId,
                                resourceType
                        ),
                        schemaDto
                );
                sourceRecordsMap.put(recordData, record);
            }
            return sourceRecordsMap.get(recordData);
        } catch (CrgDaoException e) {
            throw SmevRequestException.crgDaoException(e);
        }
    }

    @NotNull
    protected IRecord getRecordByJsonIdValue(ResourceType resourceType,
                                             String workspace,
                                             String schemaId,
                                             String libId,
                                             String jsonFieldName,
                                             Long jsonIdValue) {
        try {
            var recordData = RecordData.byJsonId(libId, jsonFieldName, jsonIdValue);
            if (!sourceRecordsMap.containsKey(recordData)) {
                var schemaDto = ofNullable(schemaId)
                        .flatMap(this::getSchema)
                        .orElse(null);
                var record = baseDao().getByJson(
                        ResourceJsonCondition.byJsonIdValue(
                                workspace,
                                libId,
                                jsonFieldName,
                                jsonIdValue,
                                resourceType
                        ),
                        schemaDto
                );
                sourceRecordsMap.put(recordData, record);
            }
            return sourceRecordsMap.get(recordData);
        } catch (CrgDaoException e) {
            throw SmevRequestException.crgDaoException(e);
        }
    }

    @Nullable
    protected IRecord findRecordByJsonIdValue(ResourceType resourceType,
                                              String workspace,
                                              String schemaId,
                                              String libId,
                                              String jsonFieldName,
                                              Long jsonIdValue) {
        var recordData = RecordData.byJsonId(libId, jsonFieldName, jsonIdValue);
        if (!sourceRecordsMap.containsKey(recordData)) {
            var schemaDto = ofNullable(schemaId)
                    .flatMap(this::getSchema)
                    .orElse(null);

            var record = baseDao()
                    .findByJson(
                            ResourceJsonCondition.byJsonIdValue(
                                    workspace,
                                    libId,
                                    jsonFieldName,
                                    jsonIdValue,
                                    resourceType
                            ),
                            schemaDto
                    )
                    .orElse(null);

            if (record != null) {
                sourceRecordsMap.put(recordData, record);
                return record;
            }
        }
        return null;
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
            schemaService().getSchemaByName(schemaName).ifPresent(schemaDto -> schemasMap.put(schemaName, schemaDto));
        }
        return ofNullable(schemasMap.get(schemaName));
    }

    public BaseDao baseDao() {
        return requestProcessor.getBaseDao();
    }

    public ISchemaService schemaService() {
        return requestProcessor.getSchemaService();
    }

    public SmevOutgoingAttachmentService attachmentService() {
        return requestProcessor.getAttachmentService();
    }
}
