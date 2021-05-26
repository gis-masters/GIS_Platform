package ru.mycrg.resource_analyzer_contract;

import java.util.Map;
import java.util.Optional;

public interface IResourceAnalyzerService {

    Optional<IResourceAnalyzer> getById(String analyzerId);

    Map<String, IResourceAnalyzer> getAnalyzers();
}
