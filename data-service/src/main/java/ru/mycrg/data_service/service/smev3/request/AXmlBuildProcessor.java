package ru.mycrg.data_service.service.smev3.request;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.resources.ResourceJsonCondition;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.RecordData;
import ru.mycrg.data_service.service.smev3.model.RefType;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
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
import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryRecordQualifier;
import static ru.mycrg.data_service.service.smev3.fields.FieldsSection.PROPERTY_FILE;

public abstract class AXmlBuildProcessor {

    protected final RequestProcessor requestProcessor;
    protected final Map<String, SchemaDto> schemasMap = new HashMap<>();
    protected final Map<RecordData, IRecord> sourceRecordsMap = new HashMap<>();
    protected final Map<UUID, SmevAttachment> attachmentsMap = new HashMap<>();

    public AXmlBuildProcessor(RequestProcessor requestProcessor) {
        this.requestProcessor = requestProcessor;
    }

    protected <T> RequestAndSources<T> buildRequest(T request) {
        return new RequestAndSources<>(
                request,
                this.sourceRecordsMap,
                this.attachmentsMap);
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
                .map(value -> prepareRefType(tableName, fieldName, value));
    }

    protected Optional<IRecord> asRefRecord(@NotNull IRecord record, @NotNull String fieldName) {
        return asString(record, fieldName)
                .map(JsonConverter::toJsonNodeFromString)
                .map(JsonNode::iterator)
                .map(Iterator::next)
                .map(jsonNode -> {
                    var table = jsonNode.get("libraryTableName").asText();
                    var id = jsonNode.get("id").asLong();

                    return getRecordById(table, table, id);
                });
    }

    protected List<File> asFileRecord(IRecord record) {
        return asString(record, PROPERTY_FILE)
                .flatMap(jsonString -> JsonConverter.<List<FileDescription>>fromJson(
                        jsonString,
                        new TypeReference<List<FileDescription>>() {
                        })
                )
                .map(fileDescriptions -> {
                    var fileUuids = fileDescriptions
                            .stream()
                            .map(FileDescription::getId)
                            .collect(Collectors.toSet());

                    return requestProcessor.getFileRepository().findAllByIdIn(fileUuids);
                })
                .orElse(List.of());
    }

    protected List<SmevAttachment> asAttachment(IRecord record) {
        return asFileRecord(record)
                .stream()
                .map(file -> {
                    if (attachmentsMap.containsKey(file.getId())) {
                        return attachmentsMap.get(file.getId());
                    } else {
                        var smevAttachment = attachmentService().pushAttachment(file);
                        attachmentsMap.put(smevAttachment.getFileId(), smevAttachment);
                        return smevAttachment;
                    }
                })
                .collect(Collectors.toList());
    }

    protected IRecord getRecordById(String schemaId,
                                    String libId,
                                    Object recordId) {
        try {
            ResourceQualifier recordQualifier = libraryRecordQualifier(libId, (Long) recordId);

            RecordData recordData = RecordData.byId(libId, recordId);
            if (sourceRecordsMap.containsKey(recordData)) {
                return sourceRecordsMap.get(recordData);
            }

            SchemaDto schemaDto = ofNullable(schemaId)
                    .flatMap(this::getSchema)
                    .orElseThrow(() -> new IllegalStateException("Не найдена схема: " + schemaId));

            IRecord record = baseDao().getById(recordQualifier, schemaDto);

            sourceRecordsMap.put(recordData, record);

            return record;
        } catch (Exception e) {
            throw new IllegalStateException("Запись не найдена: " + libId + "." + recordId);
        }
    }

    @NotNull
    protected IRecord getRecordByJsonIdValue(ResourceType resourceType,
                                             String workspace,
                                             String schemaId,
                                             String libId,
                                             String jsonFieldName,
                                             Long jsonIdValue) {
        ResourceJsonCondition jsonCondition = ResourceJsonCondition.byJsonIdValue(
                workspace,
                libId,
                jsonFieldName,
                jsonIdValue,
                resourceType);

        try {
            RecordData recordData = RecordData.byJsonId(libId, jsonFieldName, jsonIdValue);
            if (sourceRecordsMap.containsKey(recordData)) {
                return sourceRecordsMap.get(recordData);
            }

            SchemaDto schemaDto = ofNullable(schemaId)
                    .flatMap(this::getSchema)
                    .orElseThrow(() -> new IllegalStateException("Не найдена схема: " + schemaId));

            IRecord record = baseDao().getByJson(jsonCondition, schemaDto);

            sourceRecordsMap.put(recordData, record);

            return record;
        } catch (CrgDaoException e) {
            throw new IllegalStateException("Запись не найдена: " + jsonCondition);
        }
    }

    @Nullable
    protected IRecord findRecordByJsonIdValue(String workspace,
                                              String schemaId,
                                              String libId,
                                              String jsonFieldName,
                                              Long jsonIdValue) {
        RecordData recordData = RecordData.byJsonId(libId, jsonFieldName, jsonIdValue);
        if (sourceRecordsMap.containsKey(recordData)) {
            return null;
        }

        SchemaDto schemaDto = ofNullable(schemaId)
                .flatMap(this::getSchema)
                .orElseThrow(() -> new IllegalStateException("Не найдена схема: " + schemaId));

        IRecord record = baseDao()
                .findByJson(
                        ResourceJsonCondition.byJsonIdValue(
                                workspace,
                                libId,
                                jsonFieldName,
                                jsonIdValue,
                                FEATURE
                        ),
                        schemaDto)
                .orElse(null);

        if (record != null) {
            sourceRecordsMap.put(recordData, record);

            return record;
        }

        return null;
    }

    protected RefType prepareRefType(String tableName, String field, String strValue) {
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

    public BaseReadDao baseDao() {
        return requestProcessor.getBaseDao();
    }

    public ISchemaTemplateService schemaService() {
        return requestProcessor.getSchemaService();
    }

    public SmevOutgoingAttachmentService attachmentService() {
        return requestProcessor.getAttachmentService();
    }
}
