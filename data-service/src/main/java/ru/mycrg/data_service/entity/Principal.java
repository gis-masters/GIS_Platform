package ru.mycrg.data_service.entity;

import javax.persistence.*;

@Entity
@Table(name = "acl_principals")
public class Principal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(nullable = false)
    private Long identifier;

    @Column(length = 20, nullable = false)
    private String type;

    public Principal() {
        // Framework required
    }

    public Principal(Long identifier, String type) {
        this.identifier = identifier;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdentifier() {
        return identifier;
    }

    public void setIdentifier(Long identifier) {
        this.identifier = identifier;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
