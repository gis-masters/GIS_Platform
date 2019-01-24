package ru.mycrg.gis.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.dto.TableProjection;
import ru.mycrg.gis.service.GisStorageDaoService;
import ru.mycrg.gis.service.WorkImport;

import java.util.List;

@Controller
public class GisController {

    private static Logger log = LoggerFactory.getLogger(GisController.class);

    @Autowired
    private GisStorageDaoService daoService;

    @ResponseBody
    @GetMapping("/db/{dbName}/tables")
    public List<TableProjection> getDbTables(
            @PathVariable String dbName,
            @RequestParam(required = false, name = "schema", defaultValue = "public") String schemaPattern) {
        log.info("Request getDbTables by db name: {} and schema pattern: {}", dbName, schemaPattern);

        // TODO: Нет более нужды в этом ендпоинте?
        return daoService.getAllTables(dbName, schemaPattern);
    }

    @ResponseBody
    @PostMapping("/db/import")
    public HttpStatus initImport(@RequestBody WorkImport workImport) {
        log.info("initImport: {}", getAsJson(workImport));

        daoService.doImport(workImport);

        return HttpStatus.OK;
    }

    private String getAsJson(WorkImport workImport) {
        ObjectMapper mapper = new ObjectMapper();

        String result = workImport.getDbName();
        try {
            result = mapper.writeValueAsString(workImport);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return result;
    }

}
