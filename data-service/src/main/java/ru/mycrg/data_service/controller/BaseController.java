package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.entity.Process;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;

public class BaseController {

    private final Logger log = LoggerFactory.getLogger(BaseController.class);

    @NotNull
    public HttpHeaders createHeadersWithLinkToProcess(Process process) {
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/data/processes/{processId}")
                .build(process.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return headers;
    }

    @NotNull
    public String defineFileContentType(HttpServletRequest request, Resource resource) {
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.warn("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return contentType;
    }
}
