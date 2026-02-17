package ru.mycrg.common_contracts.generated.data_service.gpkg.contents;

import ru.mycrg.common_contracts.enums.GpkgContentsDataType;

public class GpkgContentsAttributes extends GpkgContentsBaseDto {

    private boolean isCrg;

    public GpkgContentsAttributes() {
        super();
    }

    public GpkgContentsAttributes(String tableName, GpkgContentsDataType dataType, String description, boolean isCrg) {
        super(tableName, dataType, description);

        this.isCrg = isCrg;
    }

    public boolean isCrg() {
        return isCrg;
    }

    public void setCrg(boolean crg) {
        isCrg = crg;
    }
}
