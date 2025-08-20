package ru.mycrg.acceptance.data_service.dto;

import javax.validation.constraints.Size;

public class TableUpdateDto {

    private String title;

    @Size(min = 8, max = 20, message = "Ожидается строка вида: 'EPSG:28406'")
    private String crs;

    @Size(max = 100, message = "Не должно превышать 100 символов")
    private String status;

    private Boolean isPublic;

    private Boolean readyForFts;

    private String fias__address;

    private String fias__oktmo;

    private Long fias__id;

    public TableUpdateDto() {
        // Required
    }

    public TableUpdateDto(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public String getFias__address() {
        return fias__address;
    }

    public void setFias__address(String fias__address) {
        this.fias__address = fias__address;
    }

    public String getFias__oktmo() {
        return fias__oktmo;
    }

    public void setFias__oktmo(String fias__oktmo) {
        this.fias__oktmo = fias__oktmo;
    }

    public Long getFias__id() {
        return fias__id;
    }

    public void setFias__id(Long fias__id) {
        this.fias__id = fias__id;
    }

    public Boolean getReadyForFts() {
        return readyForFts;
    }

    public void setReadyForFts(Boolean readyForFts) {
        this.readyForFts = readyForFts;
    }
}
