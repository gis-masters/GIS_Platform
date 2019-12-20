package ru.mycrg.gis.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.exceptions.NotFoundException;
import ru.mycrg.gis.service.StorageService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
public class ExportController extends BaseController {

    private static Logger log = LoggerFactory.getLogger(ExportController.class);

    private final StorageService storageService;

    @Autowired
    public ExportController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/export/{fileName:.+}")
    public ResponseEntity<Resource> download(@PathVariable String fileName, HttpServletRequest request) {
        log.debug("Request to download file: {}", fileName);

        Resource res = storageService.load(fileName);

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(determinateContentType(request, res)))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + res.getFilename() + "\"")
                .body(res);
    }

    @NotNull
    private String determinateContentType(@NotNull HttpServletRequest request, @NotNull Resource resource) {
        String contentType;
        try {
            String absolutePath = resource.getFile().getAbsolutePath();
            contentType = request.getServletContext().getMimeType(absolutePath);
        } catch (IOException e) {
            log.error("Wrong file URL", e);

            throw new NotFoundException("Wrong file URL");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return contentType;
    }

}
