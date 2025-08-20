package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

public class BaseResponseEvent extends DefaultMessageBusResponseEvent {

    private ProcessStatus status;
    private String description;
    private int progress = -1;
    private Object payload;
    private String error;

    private Long processId;
    private String dbName;

    public BaseResponseEvent() {
        super();
    }

    public BaseResponseEvent(IMessageBusEvent event, String exchange, String key) {
        super(event, exchange, key);
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }
}
