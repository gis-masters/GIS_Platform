package ru.mycrg.gis_service.entity;

import javax.persistence.*;

@Entity
@Table(name = "acl_roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial", nullable = false)
    private long id;

    @Column(length = 20, nullable = false)
    private String name;

    public Role() {
        // Framework required
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
