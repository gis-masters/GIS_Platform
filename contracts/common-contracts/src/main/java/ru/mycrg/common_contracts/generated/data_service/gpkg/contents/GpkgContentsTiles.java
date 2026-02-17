package ru.mycrg.common_contracts.generated.data_service.gpkg.contents;

import ru.mycrg.common_contracts.enums.GpkgContentsDataType;

public class GpkgContentsTiles extends GpkgContentsBaseDto {

    private Integer sriId;

    public GpkgContentsTiles() {
        super();
    }

    public GpkgContentsTiles(String tableName, GpkgContentsDataType dataType, String description, Integer sriId) {
        super(tableName, dataType, description);

        this.sriId = sriId;
    }

    public Integer getSriId() {
        return sriId;
    }

    public void setSriId(Integer sriId) {
        this.sriId = sriId;
    }
}
