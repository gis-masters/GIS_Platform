package ru.mycrg.gis.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;

@Entity
@Table(name = "validation_result")
public class ValidationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String type;

    @Column
    private String objectId;

    @Column
    private String objectId2;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
