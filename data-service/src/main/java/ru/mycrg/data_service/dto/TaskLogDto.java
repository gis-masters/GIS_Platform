package ru.mycrg.data_service.dto;

public class TaskLogDto {

    private String eventType;
    private Long taskId;

    public TaskLogDto() {
        // Required
    }

    public TaskLogDto(String eventType, Long taskId) {
        this.eventType = eventType;
        this.taskId = taskId;
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
}
