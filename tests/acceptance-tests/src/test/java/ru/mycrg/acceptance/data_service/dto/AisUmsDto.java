package ru.mycrg.acceptance.data_service.dto;

public class AisUmsDto {

    private String name;
    private String cadNum;
    private String regNum;
    private String propertyType;
    private String departmentName;

    public AisUmsDto(String name, String cadNum, String regNum, String propertyType, String departmentName) {
        this.name = name;
        this.cadNum = cadNum;
        this.regNum = regNum;
        this.propertyType = propertyType;
        this.departmentName = departmentName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCadNum() {
        return cadNum;
    }

    public void setCadNum(String cadNum) {
        this.cadNum = cadNum;
    }

    public String getRegNum() {
        return regNum;
    }

    public void setRegNum(String regNum) {
        this.regNum = regNum;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
}
