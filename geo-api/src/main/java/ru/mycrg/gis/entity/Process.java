package ru.mycrg.gis.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.Where;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.ProcessType;

import javax.persistence.*;

@Entity
@Where(clause="is_active=1")
@Table(name="processes")
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
public class Process {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @ManyToOne
    private User user;

    @Column
    private String name;

    @Enumerated(value = EnumType.STRING)
    private ProcessStatus status = ProcessStatus.PENDING;

    @Enumerated(value = EnumType.STRING)
    private ProcessType type;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "json")
    private JsonNode extra;

    @Column(name="is_active")
    private Boolean active = true;

    public Process() {}

    public Process(String name, ProcessType type) {
        this.name = name;
        this.type = type;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public JsonNode getExtra() {
        return extra;
    }

    public void setExtra(JsonNode extra) {
        this.extra = extra;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public ProcessType getType() {
        return type;
    }

    public void setType(ProcessType type) {
        this.type = type;
    }
}
