package ru.mycrg.data_service.entity;

import ru.mycrg.data_service.util.JsonConverter;

import java.util.List;
import java.util.Map;

public interface IContent {
    default Map<String, Object> content() {
        return JsonConverter.asKeyValueMap(this);
    }

    default Map<String, Object>[] asBatch() {
        return List.of(content()).toArray(Map[]::new);
    }
}
