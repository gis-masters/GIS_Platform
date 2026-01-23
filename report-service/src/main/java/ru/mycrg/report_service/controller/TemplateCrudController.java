package ru.mycrg.report_service.controller;

import org.jetbrains.annotations.NotNull;
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
import ru.mycrg.common_contracts.generated.report_service.TemplateShortProjection;
import ru.mycrg.report_service.entity.Template;
import ru.mycrg.report_service.exceptions.BadRequestException;
import ru.mycrg.report_service.services.FileService;
import ru.mycrg.report_service.services.TemplateService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpHeaders.CONTENT_LENGTH;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN;
import static ru.mycrg.report_service.mappers.TemplateMapper.mapToTemplateFullInfo;
import static ru.mycrg.report_service.services.DataServiceSpeaker.FILE_MEDIA_TYPE;

@RestController
@RequestMapping(value = "/temlates")
public class TemplateCrudController {

    private final Logger log = LoggerFactory.getLogger(TemplateCrudController.class);

    private final TemplateService templateService;
    private final FileService fileService;

    public TemplateCrudController(TemplateService templateService, FileService fileService) {
        this.templateService = templateService;
        this.fileService = fileService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<TemplateShortProjection>> getAllTemplatesShortData() {
        log.debug("Попросили вернуть все шаблоны печати");
        List<TemplateShortProjection> subAnswer = templateService.getAll();

        log.debug("Шаблонов нашли: {}", subAnswer.size());

        return ResponseEntity.ok(subAnswer);
    }

    @GetMapping("/{name}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<TemplateFullInfo> getTemplateByName(@PathVariable String name) {
        Template template = templateService.getTemplateByName(name);

        return ResponseEntity.ok(mapToTemplateFullInfo(template));
    }

    @GetMapping("/{name}/download")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Resource> downloadTemplate(@PathVariable String name,
                                                     HttpServletRequest request) {
        Template template = templateService.getTemplateByName(name);

        ContentDisposition contentDisposition = ContentDisposition.builder("attachment")
                                                                  .filename(template.getName(), UTF_8)
                                                                  .build();

        Resource resource;
        String size;
        try {
            resource = fileService.loadFileByPath(template.getPath());

            size = String.valueOf(resource.contentLength());
        } catch (Exception e) {
            throw new BadRequestException("При скачивании шаблона печати возникла ошибка: " + e.getMessage());
        }

        return ResponseEntity.ok()
                             .contentType(MediaType.parseMediaType(defineFileContentType(request, resource)))
                             .header(CONTENT_DISPOSITION, contentDisposition.toString())
                             .header(CONTENT_LENGTH, size)
                             .body(resource);
    }

    @PostMapping()
    @PreAuthorize(ORG_ADMIN)
    public ResponseEntity<TemplateShortInfo> createNewTemplate(@Valid @RequestPart("dto") TemplateCreateDto dto,
                                                               @NotNull @RequestPart("file") MultipartFile file) {
        validateCreateTemplateRequest(dto);
        log.debug("Попытка сохранения шаблона {}", dto);
        TemplateShortInfo createdTemplateId = templateService.createTemplate(dto, file);

        return ResponseEntity.ok(createdTemplateId);
    }

    @DeleteMapping("/{name}")
    @PreAuthorize(ORG_ADMIN)
    public ResponseEntity<Object> deleteTemplateById(@PathVariable String name) {
        log.debug("Попросили удалить шаблон по имени = {}", name);

        templateService.deleteTemplate(name);

        return ResponseEntity.ok(ResponseEntity.noContent());
    }

    private static void validateCreateTemplateRequest(TemplateCreateDto dto) {
        if (dto.getName() == null || dto.getName().isEmpty()) {
            throw new BadRequestException("Поле name является обязательным!!!");
        }

        if (dto.getTitle() == null || dto.getTitle().isEmpty()) {
            throw new BadRequestException("Поле title является обязательным!!!");
        }
    }

    @NotNull
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
