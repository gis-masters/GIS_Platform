package ru.mycrg.common_contracts.generated.gpkg;

import java.io.Serializable;

public class ExportGpkgPayload implements Serializable {

    GpkgExportType type;
    Object payload;

    public ExportGpkgPayload() {
        // Required
    }

    public GpkgExportType getType() {
        return type;
    }

    public void setType(GpkgExportType type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
