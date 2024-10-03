package ru.mycrg.data_service.service.gisogd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.service.resources.ResourceQualifier.recordQualifier;

@Component
public class DocLibraryPublisher implements IGisogdRfPublisher {

    private static final Logger log = LoggerFactory.getLogger(DocLibraryPublisher.class);

    private final GisogdRfDao gisogdRfDao;
    private final RecordPublisher recordPublisher;

    public DocLibraryPublisher(GisogdRfDao gisogdRfDao,
                               RecordPublisher recordPublisher) {
        this.gisogdRfDao = gisogdRfDao;
        this.recordPublisher = recordPublisher;
    }

    @Override
    public Map<String, Long> publish(Long taskId,
                                     ResourceQualifier qualifier,
                                     int srid,
                                     Long limit) {
        Map<String, Long> resultLog = new HashMap<>();

        try {
            List<IRecord> documents = gisogdRfDao.getDocumentsForPublishing(qualifier, limit);
            log.debug("Из библиотеки: '{}' опубликуем: {} документов", qualifier.getQualifier(), documents.size());

            for (IRecord record: documents) {
                Map<String, Long> log = recordPublisher
                        .publishDocument(taskId,
                                         recordQualifier(qualifier, record.getId()),
                                         srid,
                                         record);

                log.forEach((k, v) -> {
                    Long resultTime = resultLog.getOrDefault(k, 0L);

                    resultLog.put(k, resultTime + v);
                });
            }

            log.debug("Закончили публикацию из библиотеки: '{}' \n  Result time Log: {}",
                      qualifier.getQualifier(), resultLog);
        } catch (Exception e) {
            String msg = "Не удалось выполнить публикацию библиотеки: " + qualifier.getQualifier();
            log.error("{} => {}", msg, e.getMessage());
        }

        return resultLog;
    }
}
