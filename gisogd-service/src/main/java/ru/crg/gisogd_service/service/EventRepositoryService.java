package ru.crg.gisogd_service.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.crimea.common.ReferenceField;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;

/**
 * Event repository Service.
 * @author Vladimir Nomokonov
 */
@Service
@AllArgsConstructor
public class EventRepositoryService {

    private final ObjectMapper objectMapper;

    public String findGuidByRef(String keyRef, PublishToGisogdRfEvent event) throws JsonProcessingException {
        List<ReferenceField> refs = getReferenceFields(keyRef, event);

        return getListGuidsFromChildren(event, refs, "guid")
                .findFirst()
                .orElse(null);
    }

    public List<String> findAllGuidsByRef(String keyRef, PublishToGisogdRfEvent event) throws JsonProcessingException {
        List<ReferenceField> refs = getReferenceFields(keyRef, event);

        return getListGuidsFromChildren(event, refs, "guid")
                .collect(Collectors.toList());
    }

    public String findGuidByName(String libraryTableName, PublishToGisogdRfEvent event) {

        return (String) event.getChildren().stream()
                    .filter(d -> d.getName().equals(libraryTableName))
                    .map(Document::getContent)
                    .findFirst()
                    .map(c -> c.get("guid"))
                    .orElse(null);
    }

    public List<String> findAllValuesByName(String libraryTableName, String searchKey, PublishToGisogdRfEvent event) {

        return getOneValueStream(libraryTableName, searchKey, event)
                .collect(Collectors.toList());
    }

    public String findValueByName(String libraryTableName, String searchKey, PublishToGisogdRfEvent event) {

        return getOneValueStream(libraryTableName, searchKey, event)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    private Stream<String> getListGuidsFromChildren(PublishToGisogdRfEvent event, List<ReferenceField> refs, String searchKey) {
        if (refs == null || refs.isEmpty()) {
            return Stream.empty();
        }
        List<Long> ids = refs.stream().map(ReferenceField::getId).collect(Collectors.toList());

        return event.getChildren().stream()
                    .filter(d -> d.getName().equals(refs.get(0).getLibraryTableName()))
                    .map(Document::getContent)
                    .filter(c -> ids.contains(((Number) c.get("id")).longValue()))
                    .map(c -> (String) c.get(searchKey));
    }

    private Stream<String> getOneValueStream(String libraryTableName, String searchKey, PublishToGisogdRfEvent event) {

        return event.getChildren().stream()
                    .filter(d -> d.getName().startsWith(libraryTableName))
                    .map(Document::getContent)
                    .map(c -> (String) c.get(searchKey));
    }

    private List<ReferenceField> getReferenceFields(String key, PublishToGisogdRfEvent event) throws JsonProcessingException {
        String value = (String) event.getParent().getContent().get(key);
        if (value == null) {
            return Collections.emptyList();
        }

        return objectMapper.readValue(value, new TypeReference<List<ReferenceField>>() {
        });
    }
}
