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
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.service.GmlStorageService;
import ru.mycrg.gis.service.fgistp.FeatureDescription;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@RestController
public class FgistpController {

    private static Logger log = LoggerFactory.getLogger(FgistpController.class);

    private final FgistpRuleService fgistpRuleService;
    private final GmlStorageService gmlStorageService;

    @Autowired
    public FgistpController(FgistpRuleService fgistpRuleService,
                            GmlStorageService gmlStorageService) {
        this.fgistpRuleService = fgistpRuleService;
        this.gmlStorageService = gmlStorageService;
    }

    @GetMapping("/fgistp/rules")
    public FgistpRules getAllRules() {
        log.debug("Request /fgistp/rules");

        if (fgistpRuleService.isCacheEmpty()) {
            return fgistpRuleService.updateRules();
        } else {
            return fgistpRuleService.getAllRules();
        }
    }

    @PostMapping("/fgistp/rules")
    public List<FeatureDescription> getSomeRules(@RequestBody List<String> featureNames) {
        log.info("Get {} featureDescriptions", featureNames);

        return fgistpRuleService.getFewRules(featureNames);
    }

    @GetMapping("/fgistp/rules/{className}")
    public FeatureDescription getByName(@PathVariable String className) {
        log.info("Get rule by name: {}", className);

        return fgistpRuleService.getRuleByName(className);
    }

    @GetMapping("/fgistp/rules/update")
    public FgistpRules update() {
        log.info("Request for update rules");

        return fgistpRuleService.updateRules();
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
