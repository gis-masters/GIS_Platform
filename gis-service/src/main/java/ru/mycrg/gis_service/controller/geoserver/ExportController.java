package ru.mycrg.gis_service.controller.geoserver;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.geoserver_client.services.wfs.ComplexName;
import ru.mycrg.gis_service.service.geoserver.ExportService;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/export/shape")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<byte[]> getShapeFromGeoServer(
            @RequestParam String typeName,
            @RequestParam String srsName,
            @RequestParam String layerTitle,
            @RequestParam(defaultValue = "UTF-8") String charset) {
        ComplexName complexName = ComplexName.parse(typeName);
        byte[] shapeFileData = exportService.getShapeFile(complexName, srsName, layerTitle, charset);

        String fileName = layerTitle + ".zip";
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8)
                                           .replace("+", "%20");

        String contentDisposition = String.format("attachment; filename=\"%s\"; filename*=UTF-8''%s",
                                                  fileName, encodedFileName);

        return ResponseEntity.ok()
                             .contentType(MediaType.parseMediaType("application/zip"))
                             .header("Content-Disposition", contentDisposition)
                             .body(shapeFileData);
    }
}
