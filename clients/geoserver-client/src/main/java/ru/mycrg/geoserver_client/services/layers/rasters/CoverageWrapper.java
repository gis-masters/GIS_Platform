package ru.mycrg.geoserver_client.services.layers.rasters;

public class CoverageWrapper {

    public final CoverageModel coverage;

    public CoverageWrapper(CoverageModel coverage) {
        this.coverage = coverage;
    }

    public CoverageModel getCoverage() {
        return coverage;
    }
}
