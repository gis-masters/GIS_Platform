package ru.mycrg.data_service.controller;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.entity.Process;

import java.net.URI;

public class BaseController {

    @NotNull
    HttpHeaders createHeadersWithLinkToProcess(Process process) {
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/data/processes/{processId}")
                .build(process.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return headers;
    }
}
