package ru.mycrg.report_service.dto;

public class CarbonDto {

    private Object data;
    private String convertTo;

    //Специально без сетеров и пустого конструктора чтобы "гарантировать" что поля будут заполнены
    private final String lang;
    private final String timezone;

    public CarbonDto(Object data, String convertTo, String lang, String timezone) {
        this.data = data;
        this.convertTo = convertTo;
        this.lang = lang;
        this.timezone = timezone;
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

    public String getLang() {
        return lang;
    }

    public String getTimezone() {
        return timezone;
    }
}
