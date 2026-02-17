package ru.mycrg.common_contracts.generated.data_service.gpkg.contents;

import ru.mycrg.common_contracts.enums.GpkgContentsDataType;

public class GpkgContentsFeatures extends GpkgContentsBaseDto {

    private Long featureCount;
    private Integer sriId;

    public GpkgContentsFeatures() {
        super();
    }

    public GpkgContentsFeatures(String tableName,
                                GpkgContentsDataType dataType,
                                String description,
                                Long featureCount,
                                Integer sriId) {
        super(tableName, dataType, description);

        this.featureCount = featureCount;
        this.sriId = sriId;
    }

    public Long getFeatureCount() {
        return featureCount;
    }

    public void setFeatureCount(Long featureCount) {
        this.featureCount = featureCount;
    }

    public Integer getSriId() {
        return sriId;
    }

    public void setSriId(Integer sriId) {
        this.sriId = sriId;
    }
}
