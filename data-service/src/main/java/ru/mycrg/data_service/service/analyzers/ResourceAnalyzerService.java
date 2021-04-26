package ru.mycrg.data_service.service.analyzers;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerService;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

@Service
public class ResourceAnalyzerService implements IResourceAnalyzerService {

    private final Map<String, IResourceAnalyzer> resourceAnalyzers;

    public ResourceAnalyzerService(List<IResourceAnalyzer> resourceAnalyzers) {
        this.resourceAnalyzers = resourceAnalyzers.stream()
                                                  .collect(toMap(IResourceAnalyzer::getId, Function.identity()));
    }

    @Override
    public Map<String, IResourceAnalyzer> getResourceAnalyzers() {
        return resourceAnalyzers;
    }

    @Override
    public IResourceAnalyzer getById(String analyzerId) {
        IResourceAnalyzer resourceAnalyzer = resourceAnalyzers.get(analyzerId);
        if (resourceAnalyzer == null) {
            throw new NotFoundException("Not found analyzer by id: " + analyzerId);
        }

        return resourceAnalyzer;
    }
}
