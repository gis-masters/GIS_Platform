package ru.mycrg.integration_service.controllers;

import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.dto.ResourceAnalyzeModel;
import ru.mycrg.integration_service.service.ResourceAnalyzerService;

import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;

@RestController
@RequestMapping(value = "/resource-analyzers")
public class AnalyzersController {

    private final BaseHttpService baseHttpService;
    private final IAuthenticationFacade authenticationFacade;
    private final ResourceAnalyzerService resourceAnalyzerService;

    public AnalyzersController(BaseHttpService baseHttpService,
                               IAuthenticationFacade authenticationFacade,
                               ResourceAnalyzerService resourceAnalyzerService) {
        this.baseHttpService = baseHttpService;
        this.authenticationFacade = authenticationFacade;
        this.resourceAnalyzerService = resourceAnalyzerService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<ResourceAnalyzeModel>> getDefinitions() {
        return ResponseEntity.ok(resourceAnalyzerService.getAllAnalyzers());
    }

    @PostMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<String> analyze(
            @RequestParam(name = "resourceType", required = false) String resourceType,
            @RequestParam(name = "analyzerIds", required = false) Set<String> analyzerIds) {
        final String processId = resourceAnalyzerService.analyze(resourceType, analyzerIds);

        return ResponseEntity.accepted()
                             .body(processId);
    }

//    @PostMapping("/test")
//    public ResponseEntity<String> test() {
//        try {
//            Request request = new Request.Builder()
//                    .url(new URL(baseHttpService.getDataServiceUrl(), "/datasets"))
//                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
//                    .post(okhttp3.RequestBody.create(JSON_MEDIA_TYPE, "\"title\": \"some test title\""))
//                    .build();
//
//            Response response = httpClient.newCall(request).execute();
//            if (!response.isSuccessful()) {
//                throw new IllegalStateException();
//            } else {
//                String bodyAsJson = response.body().string();
//                Optional<HashMap> hashMap = fromJson(bodyAsJson, HashMap.class);
//
//                String location = response.header("Location");
//                String datasetId = location.split("/datasets/")[1];
//
//                String s = "";
//            }
//
//            response.close();
//        } catch (Exception e) {
//            throw new IllegalStateException("Не удалось создать набор данных 2222 " + e.getMessage(), e);
//        }
//
//        return ResponseEntity.ok().build();
//    }
}
