package ru.mycrg.gis.dto;

import java.util.List;

public class ValidationRequestDto extends BaseRequest {

    private List<ResourceProjectionDto> resources;

    public ValidationRequestDto() {}

    public List<ResourceProjectionDto> getResources() {
        return resources;
    }

    public void setResources(List<ResourceProjectionDto> resources) {
        this.resources = resources;
    }

}
