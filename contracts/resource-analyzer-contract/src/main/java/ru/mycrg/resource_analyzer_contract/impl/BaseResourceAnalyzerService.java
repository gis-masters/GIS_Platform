package ru.mycrg.resource_analyzer_contract.impl;

import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

public class BaseResourceAnalyzerService implements IResourceAnalyzerService {

    private final Map<String, IResourceAnalyzer> resourceAnalyzers;

    public BaseResourceAnalyzerService(List<IResourceAnalyzer> resourceAnalyzers) {
        this.resourceAnalyzers = resourceAnalyzers.stream()
                                                  .collect(toMap(IResourceAnalyzer::getId, Function.identity()));
    }

    @Override
    public Map<String, IResourceAnalyzer> getAnalyzers() {
        return resourceAnalyzers;
    }

    @Override
    public Optional<IResourceAnalyzer> getById(String analyzerId) {
        return Optional.ofNullable(resourceAnalyzers.get(analyzerId));
    }
}
