package ru.mycrg.gis_service.dto.project;

import javax.validation.constraints.Size;

public class ProjectDto {

    @Size(max = 2048, message = "Не более 2048 символов")
    protected String description;

    @Size(min = 1, max = 200, message = "bbox ожидается в формате: [3788517, 5579665, 3848968, 5614937]")
    protected String bbox;

    protected boolean isDefault;

    public ProjectDto() {
        // Required
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBbox() {
        return bbox;
    }

    public void setBbox(String bbox) {
        this.bbox = bbox;
    }

    public boolean getDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    @Override
    public String toString() {
        return "{" +
                "\"description\":" + (description == null ? "null" : "\"" + description + "\"") + ", " +
                "\"bbox\":" + (bbox == null ? "null" : "\"" + bbox + "\"") + ", " +
                "\"isDefault\":\"" + isDefault + "\"" +
                "}";
    }
}
