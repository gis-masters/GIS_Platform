package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.service.export.ExportService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.validation.ValidationService;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.Processable;
import ru.mycrg.mq_queue_contract.enums.ProcessType;

/**
 * Данный диспетчер находит нужный обработчик события, имплементирующий {@link Processable}
 */
@Service
public class EventDispatcher {

    private static final Logger log = LoggerFactory.getLogger(EventDispatcher.class);

    private final ValidationService validationService;
    private final ImportService importService;
    private final ExportService exportService;

    public EventDispatcher(ValidationService validationService,
                           ImportService importService,
                           ExportService exportService) {
        this.validationService = validationService;
        this.importService = importService;
        this.exportService = exportService;
    }

    public void handleEvent(BaseMqProcessResponse mqResponse) {
        try {
            getHandler(mqResponse.getType())
                    .handleMqResponse(mqResponse);
        } catch (Exception e) {
            log.error("Error handle response: {}", e.getMessage());
        }
    }

    private Processable getHandler(ProcessType type) throws Exception {
        switch (type) {
            case IMPORT:
                return importService;
            case EXPORT:
                return exportService;
            case VALIDATION:
                return validationService;
            default:
                throw new Exception("Not processable event type");
        }
    }
}
