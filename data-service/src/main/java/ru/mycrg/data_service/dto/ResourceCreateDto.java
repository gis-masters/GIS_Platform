package ru.mycrg.data_service.dto;

import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class ResourceCreateDto {

    @NotBlank
    @Size(max = 250, message = "Не должно превышать 250 символов")
    private String title;

    @Size(max = 1000, message = "Не должно превышать 1000 символов")
    private String details;

    @Size(max = 50, message = "Не должно превышать 50 символов")
    private String oktmo;

    @Size(max = 100, message = "Не должно превышать 100 символов")
    private String docType;

    private LocalDateTime docApproveDate;

    @Range(min = 500, max = 100000, message = "Номинальный масштаб должен быть в диапазоне от 500 до 100 000")
    private Integer scale;

    public ResourceCreateDto() {
        // Framework required
    }

    public ResourceCreateDto(String title) {
        this.title = title;
    }

    public ResourceCreateDto(String title, String details, String oktmo, String docType,
                             LocalDateTime docApproveDate, Integer scale) {
        this.title = title;
        this.details = details;
        this.oktmo = oktmo;
        this.docType = docType;
        this.docApproveDate = docApproveDate;
        this.scale = scale;
    }

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

    public String getDocType() {
        return docType;
    }

    public void setDocType(String docType) {
        this.docType = docType;
    }

    public LocalDateTime getDocApproveDate() {
        return docApproveDate;
    }

    public void setDocApproveDate(LocalDateTime docApproveDate) {
        this.docApproveDate = docApproveDate;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }
}
