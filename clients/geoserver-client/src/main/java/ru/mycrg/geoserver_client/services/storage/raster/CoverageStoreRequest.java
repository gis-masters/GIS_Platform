package ru.mycrg.geoserver_client.services.storage.raster;

public class CoverageStoreRequest {
    public final CoverageStoreRequestModel coverageStore;

    public CoverageStoreRequest(CoverageStoreRequestModel coverageStore) {
        this.coverageStore = coverageStore;
    }

    public CoverageStoreRequestModel getCoverageStore() {
        return coverageStore;
    }
}
