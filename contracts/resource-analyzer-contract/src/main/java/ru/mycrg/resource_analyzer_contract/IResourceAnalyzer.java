package ru.mycrg.resource_analyzer_contract;

import java.util.List;

public interface IResourceAnalyzer {

    List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources);

    IResourceDefinition getResourceDefinition();

    String getId();

    String getTitle();

    String getErrorMessageTemplate();

    int getBatchSize();
}
