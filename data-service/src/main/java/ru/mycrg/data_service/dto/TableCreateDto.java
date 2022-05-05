package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import ru.mycrg.data_service_contract.dto.AdditionalFieldDto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class TableCreateDto extends ResourceCreateDto {

    @NotBlank
    @Size(min = 3, max = 60)
    @Pattern(regexp = "^[a-z].[a-z0-9_]*$", message = "Название некорректно. Может содержать только: буквы " +
            "латинского алфавита в нижнем регистре, цифры и символ '_'. Должно начинаться с букв.")
    private String name;

    @NotBlank
    @Size(min = 8, max = 20, message = "Ожидается строка вида: 'EPSG:28406'")
    private String crs;

    @NotBlank
    @Size(min = 2, max = 50)
    private String schemaId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate docTerminationDate;

    @Size(max = 100, message = "Не должно превышать 100 символов")
    private String status;

    private Boolean isPublic;

    private String fias__address;

    private String fias__oktmo;

    private Long fias__id;

    private List<AdditionalFieldDto> additionalFields = new ArrayList<>();

    public TableCreateDto() {
        super();
    }

    public TableCreateDto(String title) {
        super(title);
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
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

    public List<AdditionalFieldDto> getAdditionalFields() {
        return additionalFields;
    }

    public void setAdditionalFields(List<AdditionalFieldDto> additionalFields) {
        this.additionalFields = additionalFields;
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

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"crs\":" + (crs == null ? "null" : "\"" + crs + "\"") + ", " +
                "\"schemaId\":" + (schemaId == null ? "null" : "\"" + schemaId + "\"") + ", " +
                "\"status\":" + (status == null ? "null" : "\"" + status + "\"") + ", " +
                "\"additionalFields\":" + (additionalFields == null ? "null" : additionalFields) +
                "}";
    }
}
