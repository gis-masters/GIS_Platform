package ru.mycrg.gis_service.service.resource_analyze;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.impl.BaseResourceAnalyzerService;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerService;

import java.util.List;

@Configuration
public class AnalyzerConfig {

    @Bean
    public IResourceAnalyzerService resourceAnalyzerService(List<IResourceAnalyzer> resourceAnalyzers) {
        return new BaseResourceAnalyzerService(resourceAnalyzers);
    }
}
