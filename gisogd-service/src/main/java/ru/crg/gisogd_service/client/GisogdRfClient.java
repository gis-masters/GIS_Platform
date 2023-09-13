package ru.crg.gisogd_service.client;

import feign.Headers;
import org.apache.camel.Body;
import org.apache.camel.Header;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.crg.gisogd_service.config.GisogdFeignConfig;
import ru.crg.gisogd_service.model.rf.AuditResponse;
import ru.crg.gisogd_service.model.rf.Classifiers;
import ru.crg.gisogd_service.model.rf.DocumentPagedModel;

@FeignClient(value = "gisogdRfClient", url = "${spring.cloud.openfeign.client.config.gisogdRfClient.url}"
        , configuration = {GisogdFeignConfig.class})
public interface GisogdRfClient {

    @GetMapping(value = "/Classifiers")
    Classifiers getClassifiers();

    @GetMapping("/Audit")
    AuditResponse getAudit(@RequestHeader("EntityType") String entityType, @RequestHeader("Guid") String guid);

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

    @PostMapping("/DocumentsFiles")
    @Headers("Content-Type: multipart/form-data")
    void sendDocument(@Header("docClass") @RequestHeader("Class") String docClass,
                      @Header("docGuid") @RequestHeader("Guid") String docGuid,
                      @Body MultipartFile file);
}
