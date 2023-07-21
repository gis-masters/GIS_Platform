package ru.mycrg.data_service.entity;

import org.springframework.data.annotation.LastModifiedDate;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.data_service_contract.enums.TaskType;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static ru.mycrg.data_service_contract.enums.TaskStatus.*;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column
    private String description;

    @Column
    @Enumerated(value = EnumType.STRING)
    private TaskType type;

    @Column
    @Enumerated(value = EnumType.STRING)
    private TaskStatus status;

    @Column(name = "assigned_to")
    private Long assignedTo;

    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "last_modified")
    private @LastModifiedDate LocalDateTime lastModified;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column
    private UUID guid;

    @Column
    private String number;

    @Column
    private LocalDate date;

    @Column
    private String personName;

    @Column
    private String coverLetterNum;

    @Column
    private LocalDate coverLetterDate;

    @Column
    private String requestType;

    @Column
    private String isName;

    @Column
    private String dataType;

    @Column
    private String recordStatus;

    @Column
    private String userName;

    public Task() {
        // Required
    }

    public Task(TaskType type, Long ownerId, Long assignedTo, LocalDate dueDate, String description, Long creator) {
        this.type = type;
        this.ownerId = ownerId;
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.description = description;
        this.createdBy = creator;

        this.status = CREATED;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TaskType getType() {
        return type;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
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

    public void setOwnerId(Long owner) {
        this.ownerId = owner;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
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

    public UUID getGuid() {
        return guid;
    }

    public void setGuid(UUID guid) {
        this.guid = guid;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public String getCoverLetterNum() {
        return coverLetterNum;
    }

    public void setCoverLetterNum(String coverLetterNum) {
        this.coverLetterNum = coverLetterNum;
    }

    public LocalDate getCoverLetterDate() {
        return coverLetterDate;
    }

    public void setCoverLetterDate(LocalDate coverLetterDate) {
        this.coverLetterDate = coverLetterDate;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getIsName() {
        return isName;
    }

    public void setIsName(String isName) {
        this.isName = isName;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
