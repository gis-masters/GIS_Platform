package ru.mycrg.data_service.service.resource_analyze;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerService;
import ru.mycrg.resource_analyzer_contract.impl.BaseResourceAnalyzerService;

import java.util.List;

@Configuration
public class AnalyzerConfig {

    @Bean
    public IResourceAnalyzerService resourceAnalyzerService(List<IResourceAnalyzer> resourceAnalyzers) {
        return new BaseResourceAnalyzerService(resourceAnalyzers);
    }
}
