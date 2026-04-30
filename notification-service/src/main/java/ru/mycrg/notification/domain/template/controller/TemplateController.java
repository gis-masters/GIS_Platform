package ru.mycrg.notification.domain.template.controller;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.notification.domain.template.dto.TemplateRequestDto;
import ru.mycrg.notification.domain.template.dto.TemplateResponseDto;
import ru.mycrg.notification.domain.template.service.TemplateService;

import java.util.List;

@RestController
@RequestMapping("/templates")
public class TemplateController {

    private static final Logger log = LoggerFactory.getLogger(TemplateController.class);

    private final TemplateService templateService;

    @Autowired
    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping
    public ResponseEntity<List<TemplateResponseDto>> getAllTemplates() {
        log.debug("REST запрос на получение всех шаблонов");
        List<TemplateResponseDto> templates = templateService.getAllTemplates();

        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{name}")
    public ResponseEntity<TemplateResponseDto> getTemplateByName(@PathVariable String name) {
        log.debug("REST запрос на получение шаблона с именем: {}", name);
        TemplateResponseDto template = templateService.getTemplateById(name);

        return ResponseEntity.ok(template);
    }

    @PostMapping
    public ResponseEntity<TemplateResponseDto> createTemplate(@Valid @RequestBody TemplateRequestDto requestDto) {
        log.debug("REST запрос на создание нового шаблона: {}", requestDto.getName());
        TemplateResponseDto createdTemplate = templateService.createTemplate(requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTemplate);
    }

    @PutMapping("/{name}")
    public ResponseEntity<TemplateResponseDto> updateTemplate(
            @PathVariable String name,
            @Valid @RequestBody TemplateRequestDto requestDto) {
        log.debug("REST запрос на обновление шаблона с именем {}: {}", name, requestDto.getName());
        TemplateResponseDto updatedTemplate = templateService.updateTemplate(name, requestDto);

        return ResponseEntity.ok(updatedTemplate);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String name) {
        log.debug("REST запрос на удаление шаблона с именем: {}", name);
        templateService.deleteTemplate(name);

        return ResponseEntity.noContent().build();
    }
}
