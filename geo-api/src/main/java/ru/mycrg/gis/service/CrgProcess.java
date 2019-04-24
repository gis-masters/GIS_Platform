package ru.mycrg.gis.service;

import ru.mycrg.common.enums.ProcessStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public abstract class CrgProcess implements Processable {

    private final UUID id = UUID.randomUUID();
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ProcessStatus status;

    public CrgProcess() {
        this.status = ProcessStatus.PENDING;
        this.startTime = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }
}
