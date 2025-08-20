package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.FANOUT_EXPORT_RESPONSE;
import static ru.mycrg.messagebus_contract.MessageBusProperties.KEY_EXPORT_RESPONSE;

public class ExportResponseEvent extends BaseResponseEvent {

    public ExportResponseEvent() {
        super();
    }

    public ExportResponseEvent(ExportRequestEvent event, ProcessStatus status, String description, String error) {
        super(event, FANOUT_EXPORT_RESPONSE, KEY_EXPORT_RESPONSE);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setError(error);
    }

    public ExportResponseEvent(ExportRequestEvent event, ProcessStatus status, String description, int progress) {
        super(event, FANOUT_EXPORT_RESPONSE, KEY_EXPORT_RESPONSE);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
    }

    public ExportResponseEvent(ExportRequestEvent event, ProcessStatus status, String description, int progress,
                               String payload) {
        super(event, FANOUT_EXPORT_RESPONSE, KEY_EXPORT_RESPONSE);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
        setPayload(payload);
    }

    public ExportResponseEvent(ExportRequestEvent event, ProcessStatus status, String description, int progress,
                               String payload, String error) {
        super(event, FANOUT_EXPORT_RESPONSE, KEY_EXPORT_RESPONSE);

        setProcessId(event.getProcessId());
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
        setPayload(payload);
        setError(error);
    }
}
