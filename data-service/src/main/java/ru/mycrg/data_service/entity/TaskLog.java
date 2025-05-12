package ru.mycrg.data_service.entity;

import com.fasterxml.jackson.databind.JsonNode;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;

@Entity
@Table(name = "tasks_log")
public class TaskLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(name = "task_id")
    private Long taskId;

    @Column
    @Type(type = "jsonb-node")
    private JsonNode message;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "created_at")
    private LocalDateTime createdAt = now();

    @Column(name = "created_by")
    private Long createdBy;

    public TaskLog() {
        //Required
    }

    public TaskLog(Long id, Long taskId, JsonNode message, String eventType, LocalDateTime createdAt, Long createdBy) {
        this.id = id;
        this.taskId = taskId;
        this.message = message;
        this.eventType = eventType;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JsonNode getMassage() {
        return message;
    }

    public void setMassage(JsonNode massage) {
        this.message = massage;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
}
