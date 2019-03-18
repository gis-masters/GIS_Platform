package ru.mycrg.gis.dto;

import java.util.List;

public class GmlRequestDto {

    private String docSchema;
    private String id;
    private List<ValidationRequestDto> resources;

    public GmlRequestDto() {}

    public String getDocSchema() {
        return docSchema;
    }

    public void setDocSchema(String docSchema) {
        this.docSchema = docSchema;
    }

    public List<ValidationRequestDto> getResources() {
        return resources;
    }

    public void setResources(List<ValidationRequestDto> resources) {
        this.resources = resources;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
