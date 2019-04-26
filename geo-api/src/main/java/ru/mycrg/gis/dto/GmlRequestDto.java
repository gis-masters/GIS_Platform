package ru.mycrg.gis.dto;

import java.util.List;

public class GmlRequestDto extends BaseRequest {

    private String docSchema;
    private List<ResourceProjectionDto> resources;

    public GmlRequestDto() {}

    public String getDocSchema() {
        return docSchema;
    }

    public void setDocSchema(String docSchema) {
        this.docSchema = docSchema;
    }

    public List<ResourceProjectionDto> getResources() {
        return resources;
    }

    public void setResources(List<ResourceProjectionDto> resources) {
        this.resources = resources;
    }

}
