package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class AisUmsDto {

    @Size(max = 255, message = "Не должно превышать 255 символов")
    private String name;

    @Size(max = 50, message = "Не должно превышать 50 символов")
    private String cadNum;

    @NotBlank
    @Size(max = 50, message = "Не должно превышать 50 символов")
    private String regNum;

    @Size(max = 50, message = "Не должно превышать 50 символов")
    private String propertyType;

    @Size(max = 255, message = "Не должно превышать 255 символов")
    private String departmentName;

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
