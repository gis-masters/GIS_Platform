package ru.mycrg.report_service.dto;

public class CarbonDto {

    private Object data;
    private String convertTo;

    public CarbonDto() {
    }

    public CarbonDto(Object data, String convertTo) {
        this.data = data;
        this.convertTo = convertTo;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getConvertTo() {
        return convertTo;
    }

    public void setConvertTo(String convertTo) {
        this.convertTo = convertTo;
    }
}
