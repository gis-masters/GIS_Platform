package ru.mycrg.gis.dto;

import java.util.List;

public class GmlRequestDto {

    private String docSchema;
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
}
