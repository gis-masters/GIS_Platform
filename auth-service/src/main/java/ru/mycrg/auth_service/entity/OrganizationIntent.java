package ru.mycrg.auth_service.entity;

import ru.mycrg.auth_service_contract.dto.OrganizationIntentDto;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "organization_intents")
public class OrganizationIntent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(length = 60)
    private String email;

    @Column(length = 20)
    private String token;

    @Column
    private Integer specializationId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public OrganizationIntent() {
        // Required
    }

    public OrganizationIntent(OrganizationIntentDto dto) {
        this.email = dto.getEmail();
        this.specializationId = dto.getSpecializationId();
        this.token = UUID.randomUUID().toString().substring(0, 16);
        this.createdAt = LocalDateTime.now();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getSpecializationId() {
        return specializationId;
    }

    public void setSpecializationId(Integer specialization_id) {
        this.specializationId = specialization_id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
