package ru.crg.gisogd_service.client;

import java.util.Map;

import org.apache.camel.Header;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import ru.crg.gisogd_service.config.DataServiceFeignConfig;

/**
 * Rest клиент дата сервиса.
 */
@FeignClient(value = "dataServiceClient",
        url = "${spring.cloud.openfeign.client.config.dataServiceClient.url}",
        configuration = DataServiceFeignConfig.class)
public interface DataServiceClient {

    @GetMapping(value = "/document-libraries/{docLibId}/records/as_registry")
    Map<String, Object> getDocByLibIdAndGuid(
            @Header("docLibId") @PathVariable("docLibId") String docLibId,
            @Header("filterByGuid") @RequestParam(value = "filter") String filter);

    @GetMapping(value = "/files/{fileGuid}/download")
    byte[] downloadFile(@Header("fileGuid") @PathVariable("fileGuid") String fileGuid);

    @PostMapping(value = "/document-libraries/dl_data_reports/records", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    Map<String, Object> createLibraryRecord(Map<String, ?> body);

    @GetMapping("/document-libraries/dl_data_reports/records/{recId}")
    Map<String, Object> getLibraryRecord(@PathVariable("recId") int recId);

    @PatchMapping(value = "/document-libraries/dl_data_reports/records/{recId}",
            consumes = "application/merge-patch+json",
            headers = "Host: localhost")
    void updateLibraryRecord(@PathVariable("recId") int recId, @RequestBody Map<String, Object> body);
}
