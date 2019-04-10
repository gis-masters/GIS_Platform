package ru.mycrg.gis.entity;

import javax.persistence.*;

@Entity
@Table(name="projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String geoserverName;

    @Column
    private String internalName;

    public Project() {}

    public Project(String internalName, String geoserverName) {
        this.internalName = internalName;
        this.geoserverName = geoserverName;
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
}
