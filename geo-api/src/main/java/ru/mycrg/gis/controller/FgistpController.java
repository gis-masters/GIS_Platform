package ru.mycrg.gis.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.service.GmlStorageService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;
import ru.mycrg.gis.service.gml.GmlGenerationService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.Principal;

@RestController
public class FgistpController {

    private static Logger log = LoggerFactory.getLogger(FgistpController.class);

    private final FgistpRuleService fgistpRuleService;
    private final GmlGenerationService gmlGenerationService;
    private final GmlStorageService gmlStorageService;

    @Autowired
    public FgistpController(FgistpRuleService fgistpRuleService,
                            GmlStorageService gmlStorageService,
                            GmlGenerationService gmlGenerationService) {
        this.fgistpRuleService = fgistpRuleService;
        this.gmlStorageService = gmlStorageService;
        this.gmlGenerationService = gmlGenerationService;
    }

    @GetMapping("/fgistp/rules")
    public FgistpRules getRules() {
        log.debug("Request /fgistp/rules");

        if (fgistpRuleService.isCacheEmpty()) {
            return fgistpRuleService.updateRules();
        } else {
            return fgistpRuleService.getRules();
        }
    }

    @GetMapping("/fgistp/rules/update")
    public FgistpRules update() {
        log.info("Request for update rules");

        return fgistpRuleService.updateRules();
    }

    @GetMapping("/fgistp/rules/{className}")
    public EntityType getByName(@PathVariable String className) {
        log.info("Get rule by name: {}", className);

        return fgistpRuleService.getRuleByName(className);
    }

    @ResponseBody
    @PostMapping("/fgistp/export/gml")
    public ResponseEntity<Process> gmlGeneration(@RequestBody GmlRequestDto request, Principal principal) {
        log.debug("Gml generation request");

        Process process = gmlGenerationService.initProcess(request, principal);

        return new ResponseEntity<>(process, HttpStatus.ACCEPTED);
    }

    @GetMapping("/fgistp/export/gml/{fileName:.+}")
    public ResponseEntity<Resource> download(@PathVariable String fileName, HttpServletRequest request) {
        log.debug("Request to download file: {}", fileName);

        Resource res = gmlStorageService.load(fileName);

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

            throw new CrgNotFoundException("Wrong file URL");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return contentType;
    }

}
