package ru.mycrg.data_service.queue;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.export.ExportService;
import ru.mycrg.data_service.service.import_.ImportService;
import ru.mycrg.data_service.service.validation.ValidationService;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.Processable;
import ru.mycrg.mq_queue_contract.enums.ProcessType;

@Service
public class ResponseHandlerFactory {

    private final ApplicationContext context;

    public ResponseHandlerFactory(ApplicationContext context) {
        this.context = context;
    }

    public Processable getProcessHandler(BaseMqProcessResponse mqEvent) {
        final ProcessType type = mqEvent.getType();

        switch (type) {
            case IMPORT:
                return context.getBean(ImportService.class);
            case EXPORT:
                return context.getBean(ExportService.class);
            case VALIDATION:
                return context.getBean(ValidationService.class);
            default:
                throw new DataServiceException("Not processable event type");
        }
    }
}
