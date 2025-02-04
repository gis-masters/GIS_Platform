package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class IntegrationConfig {

    @Bean
    public Map<String, String> gisogdRfPathMapper() {
        Map<String, String> pathMap = new HashMap<>();
        pathMap.put("dl_data_section3", "DataSection3");
        pathMap.put("dl_data_section3.doc_gml", "DataSection3");
        pathMap.put("dl_data_section13", "DataSection13");
        pathMap.put("dl_data_section13.doc_13.37", "DataSection13/Easement");
        pathMap.put("dl_data_section13.doc_13.19", "DataSection13/OKS");

        return pathMap;
    }
}
