package ru.mycrg.resource_analyzer_contract;

import java.net.URL;
import java.util.List;

public interface IResourceAnalyzer {

    List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources);

    List<IResourceDefinition> getResourceDefinitions();

    String getId();

    String getTitle();

    String getErrorMessageTemplate();

    int getBatchSize();

    URL getReceiveDataUrl();
}
