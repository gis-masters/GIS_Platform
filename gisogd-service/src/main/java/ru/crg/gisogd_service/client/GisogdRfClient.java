package ru.crg.gisogd_service.client;

import java.util.Map;

import org.apache.camel.Body;
import org.apache.camel.Header;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import feign.Param;
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

    @PostMapping(value = "/DocumentsFiles", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    void sendDocument( @Body @RequestBody Map<String, ?> body);
//
//
//            @Header("docClass") @Param("Class") String docClass,
//                      @Header("docGuid") @Param("Guid") String docGuid,
//                      @Body @Param("File") byte[] file);
}
