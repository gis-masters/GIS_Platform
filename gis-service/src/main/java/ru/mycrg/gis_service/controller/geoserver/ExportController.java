package ru.mycrg.gis_service.controller.geoserver;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.geoserver_client.services.wfs.ComplexName;
import ru.mycrg.gis_service.service.geoserver.ExportService;

import java.util.UUID;

@RestController
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/export/shape")
    public ResponseEntity<byte[]> getShapeFromGeoServer(
            @RequestParam String typeName,
            @RequestParam String srsName,
            @RequestParam(defaultValue = "UTF-8") String charset) {
        ComplexName complexName = ComplexName.parse(typeName);
        byte[] shapeFileData = exportService.getShapeFile(complexName, srsName, charset);
        String randomPrefix = UUID.randomUUID().toString().substring(0, 6);

        return ResponseEntity.ok()
                             .contentType(MediaType.parseMediaType("application/zip"))
                             .header("Content-Disposition",
                                     "attachment;" +
                                             " filename=" +
                                             randomPrefix + "_" +
                                             complexName.getLayerName() +
                                             ".zip")
                             .body(shapeFileData);
    }
}
