package ru.mycrg.report_service.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.report_service.TemplateCreateDto;
import ru.mycrg.common_contracts.generated.report_service.TemplateFullInfo;
import ru.mycrg.common_contracts.generated.report_service.TemplateShortInfo;
import ru.mycrg.report_service.dto.TemplateFileInfo;
import ru.mycrg.report_service.services.TemplateService;

import java.io.IOException;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.report_service.services.DataServiceSpeaker.FILE_MEDIA_TYPE;

@RestController
@RequestMapping(value = "/templates")
public class TemplateCrudController {

    private static final Logger log = LoggerFactory.getLogger(TemplateCrudController.class);

    private final TemplateService templateService;

    public TemplateCrudController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<TemplateFullInfo>> getAllTemplatesFullInfo() {
        log.debug("Попросили вернуть все шаблоны печати");
        List<TemplateFullInfo> templates = templateService.getAllFullInfoByOrgId();

        log.debug("Шаблонов нашли: {}", templates.size());

        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{name}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<TemplateFullInfo> getTemplateByName(@PathVariable String name) {
        TemplateFullInfo template = templateService.getFullInfoByName(name);

        return ResponseEntity.ok(template);
    }

    @GetMapping("/{name}/download")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Resource> downloadTemplate(@PathVariable String name,
                                                     HttpServletRequest request) {
        TemplateFileInfo templateFile = templateService.getTemplateFileByName(name);
        Resource resource = templateFile.resource();

        ContentDisposition contentDisposition = ContentDisposition.builder("attachment")
                                                                  .filename(templateFile.name(), UTF_8)
                                                                  .build();

        return ResponseEntity.ok()
                             .contentType(MediaType.parseMediaType(defineFileContentType(request, resource)))
                             .header(CONTENT_DISPOSITION, contentDisposition.toString())
                             .contentLength(templateFile.contentLength())
                             .body(resource);
    }

    @PostMapping
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<TemplateShortInfo> createNewTemplate(@Valid @RequestPart("dto") TemplateCreateDto dto,
                                                               @RequestPart("file") MultipartFile file) {
        log.debug("Попытка сохранения шаблона {}", dto);
        TemplateShortInfo createdTemplate = templateService.createTemplate(dto, file);

        return ResponseEntity.ok(createdTemplate);
    }

    @DeleteMapping("/{name}")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Void> deleteTemplateByName(@PathVariable String name) {
        log.debug("Попросили удалить шаблон по имени = {}", name);

        templateService.deleteTemplate(name);

        return ResponseEntity.noContent().build();
    }

    private String defineFileContentType(HttpServletRequest request, Resource resource) {
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.warn("Не удалось определить тип файла.");
        }

        if (contentType == null) {
            contentType = FILE_MEDIA_TYPE;
        }

        return contentType;
    }
}
