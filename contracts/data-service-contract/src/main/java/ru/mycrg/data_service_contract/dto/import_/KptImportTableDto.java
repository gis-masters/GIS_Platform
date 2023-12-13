package ru.mycrg.data_service_contract.dto.import_;

import ru.mycrg.data_service_contract.dto.DatasetResourceQualifierDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;

public class KptImportTableDto {

    private DatasetResourceQualifierDto resourceQualifierDto;

    private SchemaDto schemaDto;

    public KptImportTableDto() {
        //required for serialization
    }

    public KptImportTableDto(DatasetResourceQualifierDto resourceQualifierDto, SchemaDto schemaDto) {
        this.resourceQualifierDto = resourceQualifierDto;
        this.schemaDto = schemaDto;
    }

    public DatasetResourceQualifierDto getResourceQualifierDto() {
        return resourceQualifierDto;
    }

    public void setResourceQualifierDto(DatasetResourceQualifierDto resourceQualifierDto) {
        this.resourceQualifierDto = resourceQualifierDto;
    }

    public SchemaDto getSchemaDto() {
        return schemaDto;
    }

    public void setSchemaDto(SchemaDto schemaDto) {
        this.schemaDto = schemaDto;
    }
}
