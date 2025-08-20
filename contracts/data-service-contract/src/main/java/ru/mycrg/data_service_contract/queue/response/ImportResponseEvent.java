package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.FANOUT_IMPORT_RESPONSE;
import static ru.mycrg.messagebus_contract.MessageBusProperties.KEY_IMPORT_RESPONSE;

public class ImportResponseEvent extends BaseResponseEvent {

    public ImportResponseEvent() {
        super();
    }

    public ImportResponseEvent(ImportRequestEvent event, ProcessStatus status, String description, int progress) {
        super(event, FANOUT_IMPORT_RESPONSE, KEY_IMPORT_RESPONSE);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
    }

    public ImportResponseEvent(ImportRequestEvent event, ProcessStatus status, String description, int progress,
                               Object payload) {
        super(event, FANOUT_IMPORT_RESPONSE, KEY_IMPORT_RESPONSE);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
        setPayload(payload);
    }

    public ImportResponseEvent(ImportRequestEvent event, ProcessStatus status, String description, String error) {
        super(event, FANOUT_IMPORT_RESPONSE, KEY_IMPORT_RESPONSE);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setError(error);
    }

    public ImportResponseEvent(ImportRequestEvent event, ProcessStatus status, String description, String error,
                               Object payload) {
        super(event, FANOUT_IMPORT_RESPONSE, KEY_IMPORT_RESPONSE);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setError(error);
        setPayload(payload);
    }
}
