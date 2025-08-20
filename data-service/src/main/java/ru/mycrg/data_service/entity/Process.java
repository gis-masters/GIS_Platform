package ru.mycrg.data_service.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.jetbrains.annotations.Nullable;
import org.springframework.hateoas.Identifiable;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name="processes")
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
public class Process implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String userName;

    @Column
    private String title;

    @Enumerated(value = EnumType.STRING)
    private ProcessStatus status = ProcessStatus.PENDING;

    @Enumerated(value = EnumType.STRING)
    private ProcessType type;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "json")
    private JsonNode extra;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "json")
    private JsonNode details;

    public Process() {}

    public Process(String user, String title, ProcessType type) {
        this.userName = user;
        this.title = title;
        this.type = type;
    }

    public Process(String user, String title, ProcessType type, JsonNode extra) {
        this.userName = user;
        this.title = title;
        this.type = type;
        this.extra = extra;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    @Nullable
    public JsonNode getExtra() {
        return extra;
    }

    public void setExtra(JsonNode extra) {
        this.extra = extra;
    }

    public ProcessType getType() {
        return type;
    }

    public void setType(ProcessType type) {
        this.type = type;
    }

    public JsonNode getDetails() {
        return details;
    }

    public void setDetails(JsonNode details) {
        this.details = details;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Process process = (Process) o;
        return id == process.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
