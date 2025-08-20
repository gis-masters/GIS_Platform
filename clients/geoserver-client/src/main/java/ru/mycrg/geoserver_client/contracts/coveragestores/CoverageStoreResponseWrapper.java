package ru.mycrg.geoserver_client.contracts.coveragestores;

public class CoverageStoreResponseWrapper {

    private CoverageStoreResponseModel coverageStore;

    public CoverageStoreResponseModel getCoverageStore() {
        return coverageStore;
    }

    public void setCoverageStore(CoverageStoreResponseModel coverageStore) {
        this.coverageStore = coverageStore;
    }
}
