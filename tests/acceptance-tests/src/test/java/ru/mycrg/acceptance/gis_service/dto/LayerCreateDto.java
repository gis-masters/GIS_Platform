package ru.mycrg.acceptance.gis_service.dto;

public class LayerCreateDto {

    private final String title;

    private final String dataset;

    private final String tableName;

    private final String styleName;

    private final String type;

    private final String schemaId;

    private final String dataStoreName;

    private final String nativeCRS;

    private final String dataSourceUri;

    public LayerCreateDto(String title, String dataset, String tableName, String styleName, String type,
                          String schemaId, String dataStoreName, String nativeCRS, String dataSourceUri) {
        this.title = title;
        this.dataset = dataset;
        this.tableName = tableName;
        this.styleName = styleName;
        this.type = type;
        this.schemaId = schemaId;
        this.dataStoreName = dataStoreName;
        this.nativeCRS = nativeCRS;
        this.dataSourceUri = dataSourceUri;
    }

    public String getTitle() {
        return title;
    }

    public String getDataset() {
        return dataset;
    }

    public String getTableName() {
        return tableName;
    }

    public String getStyleName() {
        return styleName;
    }

    public String getType() {
        return type;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public String getDataStoreName() {
        return dataStoreName;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public String getDataSourceUri() {
        return dataSourceUri;
    }
}
