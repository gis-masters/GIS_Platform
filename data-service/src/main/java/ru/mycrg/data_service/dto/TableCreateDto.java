package ru.mycrg.data_service.dto;

import ru.mycrg.data_service_contract.dto.AdditionalFieldDto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
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

    public List<AdditionalFieldDto> getAdditionalFields() {
        return additionalFields;
    }

    public void setAdditionalFields(List<AdditionalFieldDto> additionalFields) {
        this.additionalFields = additionalFields;
    }
}
