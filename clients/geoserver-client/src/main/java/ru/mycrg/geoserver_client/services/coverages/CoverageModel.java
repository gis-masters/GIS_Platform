package ru.mycrg.geoserver_client.services.coverages;

public class CoverageModel {
    public final Coverage coverage;

    public CoverageModel(Coverage coverage) {
        this.coverage = coverage;
    }

    public Coverage getCoverage() {
        return coverage;
    }
}
