package ru.mycrg.data_service.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;

@Entity
@Table(name = "schemas")
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
public class Schema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String name;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "json")
    private JsonNode classRule;

    @Column
    @Type(type="text")
    private String customRule;

    @Column
    @Type(type="text")
    private String calculatedFields;

    public Schema() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String className) {
        this.name = className;
    }

    public JsonNode getClassRule() {
        return classRule;
    }

    public void setClassRule(JsonNode classRule) {
        this.classRule = classRule;
    }

    public String getCustomRule() {
        return customRule;
    }

    public void setCustomRule(String customRule) {
        this.customRule = customRule;
    }

    public String getCalculatedFields() {
        return calculatedFields;
    }

    public void setCalculatedFields(String calculatedFields) {
        this.calculatedFields = calculatedFields;
    }
}
