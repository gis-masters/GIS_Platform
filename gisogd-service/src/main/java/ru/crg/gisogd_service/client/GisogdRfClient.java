package ru.crg.gisogd_service.client;

import org.apache.camel.Body;
import org.apache.camel.Header;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import ru.crg.gisogd_service.config.OAuthFeignConfig;
import ru.crg.gisogd_service.model.rf.AuditResponse;
import ru.crg.gisogd_service.model.rf.Classifiers;

@FeignClient(value = "gisogdRfClient", url = "${spring.cloud.openfeign.client.config.gisogdRfClient.url}"
        , configuration = OAuthFeignConfig.class)
public interface GisogdRfClient {

    @GetMapping(value = "/Classifiers")
    Classifiers getClassifiers();

    @GetMapping("/Audit")
    AuditResponse getAudit(@RequestHeader("EntityType") String entityType, @RequestHeader("Guid") String guid);

    @PostMapping(value = "/{endpoint}")
    <T> void postData(@Header("endpoint") @PathVariable String endpoint, @Body T obj);

    @PutMapping(value = "/{endpoint}")
    <T> void putData(@Header("endpoint") @PathVariable String endpoint, @Body T obj);

}
