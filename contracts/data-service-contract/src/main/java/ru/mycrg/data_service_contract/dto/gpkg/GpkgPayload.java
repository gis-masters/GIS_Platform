package ru.mycrg.data_service_contract.dto.gpkg;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

public class GpkgPayload implements Serializable {

    @NotNull
    GpkgExportTypes type;

    @NotNull
    Object payload;

    public GpkgPayload() {
        // Required
    }

    public GpkgExportTypes getType() {
        return type;
    }

    public void setType(GpkgExportTypes type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
