package ru.mycrg.gis.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import ru.mycrg.common.enums.ProcessStatus;

import javax.persistence.*;

@Entity
@Table(name="projects")
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
public class Project extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String geoserverName;

    @Column
    private String internalName;

    @Enumerated(value = EnumType.STRING)
    private ProcessStatus status = ProcessStatus.PENDING;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "json")
    private JsonNode extra;

    @ManyToOne
    private Organization organization;

    public Project() {}

    public Project(String internalName, String geoserverName) {
        this.internalName = internalName;
        this.geoserverName = geoserverName.toLowerCase();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getGeoserverName() {
        return geoserverName;
    }

    public void setGeoserverName(String geoserverName) {
        this.geoserverName = geoserverName;
    }

    public String getInternalName() {
        return internalName;
    }

    public void setInternalName(String internalName) {
        this.internalName = internalName;
    }

    public JsonNode getExtra() {
        return extra;
    }

    public void setExtra(JsonNode extra) {
        this.extra = extra;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }
}
