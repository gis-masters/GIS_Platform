package ru.mycrg.resource_analyzer_contract;

public class ResourceAnalyzerResultImpl implements IResourceAnalyzerResult {

    private final boolean isPassed;
    private final String resourceId;

    public ResourceAnalyzerResultImpl(String resourceId, boolean isPassed) {
        this.resourceId = resourceId;
        this.isPassed = isPassed;
    }

    @Override
    public boolean isPassed() {
        return isPassed;
    }

    @Override
    public String getResourceId() {
        return resourceId;
    }
}
