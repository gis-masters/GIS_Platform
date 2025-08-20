package ru.mycrg.data_service_contract.dto;

public class AdditionalFieldDto {

    private String name;

    private String type;

    public AdditionalFieldDto() {
        // Framework required
    }

    public AdditionalFieldDto(String name, String type) {
        this.name = name;
        this.type = type;
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

    @Override
    public String toString() {
        return "{" +
                "\"name\" : \"" + name + "\"," +
                "\"type\": \"" + type +
                '}';
    }
}