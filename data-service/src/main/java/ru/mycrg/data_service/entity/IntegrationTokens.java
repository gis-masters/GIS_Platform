package ru.mycrg.data_service.entity;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;

@Entity
@Table(name = "integration_tokens", schema = "public")
public class IntegrationTokens {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 255)
    @Column(name = "service_name")
    private String serviceName;

    @Size(max = 50)
    @Column(name = "token")
    private String token;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public IntegrationTokens() {
        // Framework required
    }

    public IntegrationTokens(Long id, String serviceName, String token) {
        this.id = id;
        this.serviceName = serviceName;
        this.token = token;

        this.updatedAt = now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
