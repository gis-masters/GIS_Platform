package ru.mycrg.gis.controller;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.gis.entity.Process;

import java.net.URI;

public class BaseController {

    @NotNull
    HttpHeaders createHeadersWithLinkToTask(Long orgId, Process process) {
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/organizations/{orgId}/tasks/{processId}")
                .buildAndExpand(orgId, process.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return headers;
    }

}
