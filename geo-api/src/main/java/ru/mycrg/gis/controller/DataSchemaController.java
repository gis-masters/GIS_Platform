package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.dto.FeatureDescription;
import ru.mycrg.gis.service.dataSchema.DataSchemaService;

import java.util.List;

@RestController
public class DataSchemaController {

    private static Logger log = LoggerFactory.getLogger(DataSchemaController.class);

    private final DataSchemaService dataSchemaService;

    @Autowired
    public DataSchemaController(DataSchemaService dataSchemaService) {
        this.dataSchemaService = dataSchemaService;
    }

    @PostMapping("/schema")
    public List<FeatureDescription> getSchemaForFewFeatures(@RequestBody List<String> featureNames) {
        log.info("Get dataSchema for: {}", featureNames);

        return dataSchemaService.getFewDescriptions(featureNames);
    }

    @GetMapping("/schema/{featureName}")
    public FeatureDescription getSchemaByFeatureName(@PathVariable String featureName) {
        log.info("Get dataSchema for feature: {}", featureName);

        return dataSchemaService.getDescriptionByName(featureName);
    }

}
