package ru.mycrg.data_service.service.gisogd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.record.IRecord;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class RecordsCache {

    private static final Logger log = LoggerFactory.getLogger(RecordsCache.class);

    private long commonRequest;
    private long successfullyRequest;

    private final Map<String, Map<String, IRecord>> cache = new HashMap<>();

    public void addRecord(String layerIdentifier, String identifier, IRecord record) {
        Map<String, IRecord> layerCache = cache.getOrDefault(layerIdentifier, new HashMap<>());
        layerCache.put(identifier, record);

        cache.put(layerIdentifier, layerCache);
    }

    public Optional<IRecord> getRecord(String layerIdentifier, String recordIdentifier) {
        commonRequest++;

        if (cache.containsKey(layerIdentifier)) {
            Map<String, IRecord> records = cache.get(layerIdentifier);
            if (records.containsKey(recordIdentifier)) {
                successfullyRequest++;

                return Optional.of(records.get(recordIdentifier));
            }
        }

        return Optional.empty();
    }

    public void clear() {
        this.commonRequest = 0;
        this.successfullyRequest = 0;
        this.cache.clear();

        log.info("Кеш записей был сброшен");
    }

    public void printStatistics() {
        log.info("Всего обращений: {}", commonRequest);
        log.info("Успешных: {}", successfullyRequest);
    }
}
