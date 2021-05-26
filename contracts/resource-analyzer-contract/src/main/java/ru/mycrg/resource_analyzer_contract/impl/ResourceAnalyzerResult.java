package ru.mycrg.resource_analyzer_contract.impl;

import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerResult;

public class ResourceAnalyzerResult implements IResourceAnalyzerResult {

    private final boolean isPassed;
    private final String id;

    public ResourceAnalyzerResult(String id, boolean isPassed) {
        this.id = id;
        this.isPassed = isPassed;
    }

    @Override
    public boolean isPassed() {
        return isPassed;
    }

    @Override
    public String getId() {
        return id;
    }
}
