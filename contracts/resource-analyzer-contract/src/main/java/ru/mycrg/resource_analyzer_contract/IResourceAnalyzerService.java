package ru.mycrg.resource_analyzer_contract;

import java.util.Map;

public interface IResourceAnalyzerService {

    IResourceAnalyzer getById(String analyzerId);

    Map<String, IResourceAnalyzer> getResourceAnalyzers();
}
