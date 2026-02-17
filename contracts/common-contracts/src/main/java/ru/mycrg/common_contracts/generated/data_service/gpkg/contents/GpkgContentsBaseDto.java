package ru.mycrg.common_contracts.generated.data_service.gpkg.contents;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import ru.mycrg.common_contracts.enums.GpkgContentsDataType;

import java.io.Serializable;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = GpkgContentsFeatures.class, name = "features"),
        @JsonSubTypes.Type(value = GpkgContentsTiles.class, name = "tiles"),
        @JsonSubTypes.Type(value = GpkgContentsAttributes.class, name = "attributes")
})

public class GpkgContentsBaseDto implements Serializable {

    private String tableName;
    private GpkgContentsDataType dataType;
    private String description;

    public GpkgContentsBaseDto() {
        //req
    }

    public GpkgContentsBaseDto(String tableName, GpkgContentsDataType dataType, String description) {
        this.tableName = tableName;
        this.dataType = dataType;
        this.description = description;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public GpkgContentsDataType getDataType() {
        return dataType;
    }

    public void setDataType(GpkgContentsDataType dataType) {
        this.dataType = dataType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
