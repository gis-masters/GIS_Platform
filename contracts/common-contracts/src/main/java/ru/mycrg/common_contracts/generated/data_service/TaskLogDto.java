package ru.mycrg.common_contracts.generated.data_service;

public class TaskLogDto {

    private String eventType;
    private Long taskId;
    private Long createdBy;

    public TaskLogDto() {
        // Required
    }

    public TaskLogDto(String eventType, Long taskId, Long createdBy) {
        this.eventType = eventType;
        this.taskId = taskId;
        this.createdBy = createdBy;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
}
