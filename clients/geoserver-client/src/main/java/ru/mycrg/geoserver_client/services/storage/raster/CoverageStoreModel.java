package ru.mycrg.geoserver_client.services.storage.raster;

public class CoverageStoreModel {
    public final CoverageStore coverageStore;

    public CoverageStoreModel(CoverageStore coverageStore) {
        this.coverageStore = coverageStore;
    }

    public CoverageStore getCoverageStore() {
        return coverageStore;
    }
}
