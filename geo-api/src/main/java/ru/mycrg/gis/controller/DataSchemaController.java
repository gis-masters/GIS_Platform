package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.gis.service.SchemaService;
import ru.mycrg.mq_queue_contract.SchemaDto;

import java.util.List;

@RestController
public class DataSchemaController {

    private static final Logger log = LoggerFactory.getLogger(DataSchemaController.class);

    private final SchemaService schemaService;

    @Autowired
    public DataSchemaController(SchemaService schemaService) {
        this.schemaService = schemaService;
    }

    @PostMapping("/schema")
    public List<SchemaDto> getSchemas(@RequestBody List<String> featureNames) {
        log.info("Get dataSchema for: {}", featureNames);

        return schemaService.getSchemas(featureNames);
    }

}
