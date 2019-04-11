package ru.mycrg.common;

import ru.mycrg.common.enums.EventType;
import ru.mycrg.common.enums.ProcessStatus;

import java.io.Serializable;

public class OrgMqResponse implements Serializable {

    private Long id;
    private EventType eventType;
    private ProcessStatus status;

    public OrgMqResponse() {
    }

    public OrgMqResponse(Long id, EventType eventType, ProcessStatus status) {
        this.id = id;
        this.eventType = eventType;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }
}
