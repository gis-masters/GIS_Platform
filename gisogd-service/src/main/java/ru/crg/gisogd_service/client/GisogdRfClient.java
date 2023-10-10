package ru.crg.gisogd_service.client;

import org.apache.camel.Body;
import org.apache.camel.Header;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import ru.crg.gisogd_service.config.GisogdFeignConfig;
import ru.crg.gisogd_service.model.rf.AuditResponse;
import ru.crg.gisogd_service.model.rf.Classifiers;
import ru.crg.gisogd_service.model.rf.DocumentPagedModel;

import java.util.Map;

@FeignClient(value = "gisogdRfClient", url = "${spring.cloud.openfeign.client.config.gisogdRfClient.url}"
        , configuration = {GisogdFeignConfig.class})
public interface GisogdRfClient {

    @GetMapping(value = "/Classifiers")
    Classifiers getClassifiers();

    @GetMapping("/Audit")
    AuditResponse getAudit(@Header("entityType") @RequestParam("EntityType") String entityType,
                           @Header("guid") @RequestParam("Guid") String guid);

    @PostMapping(value = "/{endpoint}")
    <T> void postData(@Header("endpoint") @PathVariable String endpoint, @Body T obj);

    @PutMapping(value = "/{endpoint}")
    <T> void putData(@Header("endpoint") @PathVariable String endpoint, @Body T obj);

    @DeleteMapping(value = "/{endpoint}/{guid}")
    void deleteData(@Header("endpoint") @PathVariable String endpoint, @Body @PathVariable String guid);

    @GetMapping(value = "/DocumentsList")
    DocumentPagedModel getRequestedDocuments(
            @Header("pageSize") @RequestParam(value = "PageSize", required = false) Integer pageSize,
            @Header("page") @RequestParam(value = "Page", required = false) Integer page
    );

    @PostMapping(value = "/DocumentsFiles", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    void sendDocument(@Body @RequestBody Map<String, ?> body);
}
