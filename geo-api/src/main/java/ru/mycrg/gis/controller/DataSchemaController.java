package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.service.data_schema.DataSchemaService;
import ru.mycrg.mq_queue_contract.SchemaDto;

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
    public List<SchemaDto> getSchemaForFewFeatures(@RequestBody List<String> featureNames) {
        log.info("Get dataSchema for: {}", featureNames);

        return dataSchemaService.getSchemas(featureNames);
    }

    @PostMapping("/schema/update")
    public HttpStatus updateSchema() {
        dataSchemaService.update();

        return HttpStatus.ACCEPTED;
    }

}
