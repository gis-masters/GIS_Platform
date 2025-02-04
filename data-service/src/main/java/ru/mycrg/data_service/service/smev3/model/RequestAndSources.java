package ru.mycrg.data_service.service.smev3.model;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Optional.ofNullable;

public class RequestAndSources<T> {

    private final T request;
    private final Map<RecordData, IRecord> sources;
    private final Map<UUID, SmevAttachment> attachments;
    private final JsonNode sourcesAsJson;
    private final JsonNode attachmentsAsJson;

    public RequestAndSources(@NotNull T request,
                             @Nullable Map<RecordData, IRecord> sources,
                             @Nullable Map<UUID, SmevAttachment> attachments) {
        this.request = request;
        this.sources = sources;
        this.attachments = attachments;

        this.sourcesAsJson = ofNullable(this.sources)
                .map(map -> map.isEmpty() ? null : map.entrySet())
                .map(Collection::stream)
                .map(this::mapSourcesToJson)
                .map(JsonConverter::toJsonNode)
                .orElse(null);
        this.attachmentsAsJson = ofNullable(this.attachments)
                .map(object -> object.isEmpty() ? null : object.values())
                .map(ArrayList::new)
                .map(JsonConverter::toJsonNode)
                .orElse(null);
    }

    public T getRequest() {
        return request;
    }

    public Map<RecordData, IRecord> getSources() {
        return sources;
    }

    public Map<UUID, SmevAttachment> getAttachments() {
        return attachments;
    }

    public JsonNode getSourcesAsJson() {
        return sourcesAsJson;
    }

    public JsonNode getAttachmentsAsJson() {
        return attachmentsAsJson;
    }

    private Map<String, Map<String, Object>> mapSourcesToJson(Stream<Map.Entry<RecordData, IRecord>> stream) {
        return stream.collect(
                Collectors.toMap(entry -> entry.getKey().getDescription(),
                                 entry -> entry.getValue().getContent()));
    }
}
