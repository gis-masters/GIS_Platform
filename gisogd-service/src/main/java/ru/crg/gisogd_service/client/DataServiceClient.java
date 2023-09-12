package ru.crg.gisogd_service.client;

import org.apache.camel.Header;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import ru.crg.gisogd_service.config.DataServiceFeignConfig;

import java.util.Map;

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
    MultipartFile downloadFile(@Header("fileGuid") @PathVariable("fileGuid") String fileGuid);
}
