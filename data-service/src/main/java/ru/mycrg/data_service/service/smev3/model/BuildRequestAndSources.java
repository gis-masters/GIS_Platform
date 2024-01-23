package ru.mycrg.data_service.service.smev3.model;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

public class BuildRequestAndSources<T> {
    private final T request;
    private final Map<RecordData, IRecord> sourceRecordsMap;
    private final Map<String, SmevAttachment> attachmentsMap;
    private final JsonNode sourcesJson;
    private final JsonNode attachmentsJson;

    public BuildRequestAndSources(
            @NotNull T request,
            @Nullable Map<RecordData, IRecord> sourceRecordsMap,
            @Nullable Map<String, SmevAttachment> attachmentsMap) {
        this.request = request;
        this.sourceRecordsMap = sourceRecordsMap;
        this.attachmentsMap = attachmentsMap;
        this.sourcesJson = ofNullable(this.sourceRecordsMap)
                .map(map -> map.isEmpty() ? null : map.entrySet())
                .map(Collection::stream)
                .map(stream -> stream.collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().getContent())))
                .map(JsonConverter::toJsonNode)
                .orElse(null);
        this.attachmentsJson = ofNullable(this.attachmentsMap)
                .map(object -> object.isEmpty() ? null : object.values())
                .map(ArrayList::new)
                .map(JsonConverter::toJsonNode)
                .orElse(null);

    }

    public T getRequest() {
        return request;
    }

    public Map<RecordData, IRecord> getSourceRecordsMap() {
        return sourceRecordsMap;
    }

    public Map<String, SmevAttachment> getAttachmentsMap() {
        return attachmentsMap;
    }

    public JsonNode getSourcesJson() {
        return sourcesJson;
    }

    public JsonNode getAttachmentsJson() {
        return attachmentsJson;
    }
}
