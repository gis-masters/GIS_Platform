package ru.mycrg.data_service_contract.dto.import_;

public class TargetAttribute {

    private String name;
    private String type;

    public TargetAttribute() {}

    public TargetAttribute(String name, String type) {
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
}
