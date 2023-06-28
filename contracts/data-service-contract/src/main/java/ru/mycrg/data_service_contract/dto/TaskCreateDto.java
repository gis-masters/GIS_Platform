package ru.mycrg.data_service_contract.dto;

import javax.validation.constraints.Pattern;
import java.time.LocalDate;

public class TaskCreateDto {

    @Pattern(regexp = "^(ASSIGNABLE|SYSTEM|CUSTOM)$", message = "Допустимые значения поля type: ASSIGNABLE, SYSTEM или CUSTOM")
    private String type;

    private Long assignedTo;

    private Long ownerId;

    private LocalDate dueDate;

    private String description;

    public TaskCreateDto() {
        // Required
    }

    public TaskCreateDto(String type, Long assignedTo, Long ownerId, LocalDate dueDate, String description) {
        this.type = type;
        this.assignedTo = assignedTo;
        this.ownerId = ownerId;
        this.dueDate = dueDate;
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(Long assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
