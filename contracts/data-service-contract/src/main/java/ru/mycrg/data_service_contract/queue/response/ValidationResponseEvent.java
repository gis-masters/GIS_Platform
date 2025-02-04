package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.ValidationRequestEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.FANOUT_VALIDATION_RESULT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.KEY_VALIDATION_RESULT;

public class ValidationResponseEvent extends BaseResponseEvent {

    public ValidationResponseEvent() {
        super();
    }

    public ValidationResponseEvent(ValidationRequestEvent event, ProcessStatus status, String description) {
        super(event, FANOUT_VALIDATION_RESULT, KEY_VALIDATION_RESULT);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
    }

    public ValidationResponseEvent(ValidationRequestEvent event, ProcessStatus status, String description, int progress) {
        super(event, FANOUT_VALIDATION_RESULT, KEY_VALIDATION_RESULT);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
    }

    public ValidationResponseEvent(ValidationRequestEvent event, ProcessStatus status, String description, int progress,
                                   String payload) {
        super(event, FANOUT_VALIDATION_RESULT, KEY_VALIDATION_RESULT);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
        setPayload(payload);
    }

    public ValidationResponseEvent(ValidationRequestEvent event, ProcessStatus status, String description, int progress,
                                   String payload, String error) {
        super(event, FANOUT_VALIDATION_RESULT, KEY_VALIDATION_RESULT);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
        setPayload(payload);
        setError(error);
    }
}
