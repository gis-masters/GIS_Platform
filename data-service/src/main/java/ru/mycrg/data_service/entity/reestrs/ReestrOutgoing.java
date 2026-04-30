package ru.mycrg.data_service.entity.reestrs;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Entity
@Table(name = "reestr_outgoing")
public class ReestrOutgoing {

    @Id
    private UUID id;

    /**
     * Список систем
     *
     * @see ru.mycrg.data_service.service.reestrs.Systems
     */
    @Column(length = 100, nullable = false)
    private String system;

    @Column(length = 100, nullable = false)
    private String userTo;

    @Column
    private String body;

    @Column
    private LocalDateTime dateOut;

    @Column(length = 20, nullable = false)
    private String status;

    @Column(length = 20)
    private String responseTo;

    public ReestrOutgoing() {
        // Framework required
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getUserTo() {
        return userTo;
    }

    public void setUserTo(String userTo) {
        this.userTo = userTo;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public LocalDateTime getDateOut() {
        return dateOut;
    }

    public void setDateOut(LocalDateTime dateOut) {
        this.dateOut = dateOut;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResponseTo() {
        return responseTo;
    }

    public void setResponseTo(String responseTo) {
        this.responseTo = responseTo;
    }
}
