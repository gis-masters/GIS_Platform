package ru.mycrg.resource_analyzer_contract.impl;

import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerResult;

public class ResourceAnalyzerResult implements IResourceAnalyzerResult {

    private final boolean passed;
    private final String id;

    public ResourceAnalyzerResult(String id, boolean passed) {
        this.id = id;
        this.passed = passed;
    }

    @Override
    public boolean isPassed() {
        return passed;
    }

    @Override
    public String getId() {
        return id;
    }
}
