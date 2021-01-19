package ru.mycrg.data_service.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class ValidationRequestDto extends BaseRequest {

    @Valid
    @NotEmpty
    private List<ExportResourceModel> resources = new ArrayList<>();

    public List<ExportResourceModel> getResources() {
        return resources;
    }

    public void setResources(List<ExportResourceModel> resources) {
        this.resources = resources;
    }
}
