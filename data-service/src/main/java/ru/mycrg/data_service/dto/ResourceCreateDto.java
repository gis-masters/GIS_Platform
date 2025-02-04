package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDate;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATE_PATTERN;

public class ResourceCreateDto {

    @NotBlank
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

    public ResourceCreateDto() {
        // Framework required
    }

    public ResourceCreateDto(String title) {
        this.title = title;
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
}
