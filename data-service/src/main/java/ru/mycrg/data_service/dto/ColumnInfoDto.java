package ru.mycrg.data_service.dto;

public class ColumnInfoDto {

    private String name;
    private String type;
    private Integer scale;

    public ColumnInfoDto() {
        // Required
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }
}
