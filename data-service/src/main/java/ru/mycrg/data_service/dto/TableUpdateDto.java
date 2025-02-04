package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Size;
import java.time.LocalDate;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATE_PATTERN;

public class TableUpdateDto {

    @Size(max = 250, message = "Не должно превышать 250 символов")
    private String title;

    @Size(max = 1000, message = "Не должно превышать 1000 символов")
    private String details;

    @Size(max = 50, message = "Не должно превышать 50 символов")
    private String oktmo;

    @Size(max = 100, message = "Не должно превышать 100 символов")
    private String documentType;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate docApproveDate;

    @Range(min = 500, max = 100000, message = "Номинальный масштаб должен быть в диапазоне от 500 до 100 000")
    private Integer scale;

    @Size(min = 8, max = 20, message = "Ожидается строка вида: 'EPSG:28406'")
    private String crs;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate docTerminationDate;

    @Size(max = 100, message = "Не должно превышать 100 символов")
    private String status;

    private Boolean isPublic;

    private Boolean readyForFts;

    private String fias__address;

    private String fias__oktmo;

    private Long fias__id;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getOktmo() {
        return oktmo;
    }

    public void setOktmo(String oktmo) {
        this.oktmo = oktmo;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public LocalDate getDocApproveDate() {
        return docApproveDate;
    }

    public void setDocApproveDate(LocalDate docApproveDate) {
        this.docApproveDate = docApproveDate;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public LocalDate getDocTerminationDate() {
        return docTerminationDate;
    }

    public void setDocTerminationDate(LocalDate docTerminationDate) {
        this.docTerminationDate = docTerminationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean aPublic) {
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
