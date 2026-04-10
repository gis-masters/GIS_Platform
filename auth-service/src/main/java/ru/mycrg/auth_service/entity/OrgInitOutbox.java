package ru.mycrg.auth_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;

@Entity
@Table(name = "org_init_outbox")
public class OrgInitOutbox {

    @Id
    @Column(name = "org_id", nullable = false)
    private Long orgId;

    @Column(columnDefinition = "smallint", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private OutboxStatus status = OutboxStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "encrypted_password", nullable = false)
    private String encryptedPassword;

    @Column(name = "specialization_id", columnDefinition = "smallint")
    private Integer specializationId;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    public OrgInitOutbox() {
        // Required
    }

    public OrgInitOutbox(Long orgId, String encryptedPassword, Integer specializationId) {
        this.orgId = orgId;
        this.encryptedPassword = encryptedPassword;
        this.specializationId = specializationId;
        this.createdAt = now();
        this.retryCount = 0;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public OutboxStatus getStatus() {
        return status;
    }

    public void setStatus(OutboxStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    public Integer getSpecializationId() {
        return specializationId;
    }

    public void setSpecializationId(Integer specializationId) {
        this.specializationId = specializationId;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
}
