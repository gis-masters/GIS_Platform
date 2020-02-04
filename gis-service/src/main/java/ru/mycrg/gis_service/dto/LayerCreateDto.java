package ru.mycrg.gis_service.dto;

import javax.validation.constraints.NotBlank;

public class LayerCreateDto {

    @NotBlank
    private String title;

    @NotBlank
    private String internalName;

    @NotBlank
    private String schemaId;

    @NotBlank
    private String dataStoreName;

    public LayerCreateDto() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInternalName() {
        return internalName;
    }

    public void setInternalName(String internalName) {
        this.internalName = internalName;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }

    public String getDataStoreName() {
        return dataStoreName;
    }

    public void setDataStoreName(String dataStoreName) {
        this.dataStoreName = dataStoreName;
    }
}
