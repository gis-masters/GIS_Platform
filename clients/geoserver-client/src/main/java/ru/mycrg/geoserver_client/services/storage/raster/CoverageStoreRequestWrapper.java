package ru.mycrg.geoserver_client.services.storage.raster;

import ru.mycrg.geoserver_client.contracts.coveragestores.CoverageStoreRequestModel;

public class CoverageStoreRequestWrapper {
    public final CoverageStoreRequestModel coverageStore;

    public CoverageStoreRequestWrapper(CoverageStoreRequestModel coverageStore) {
        this.coverageStore = coverageStore;
    }

    public CoverageStoreRequestModel getCoverageStore() {
        return coverageStore;
    }
}
