package ru.mycrg.report_service.services.dao.migrations;

 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.report_service.TemplateCreateDto;
import ru.mycrg.report_service.entity.Template;
import ru.mycrg.report_service.services.FileService;
import ru.mycrg.report_service.services.TemplateService;
import tools.jackson.databind.JsonNode;

import java.io.File;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.http_client.JsonConverter.readTreeFromFile;

@Service
public class ReportMigrationHandler {

    private final Logger log = LoggerFactory.getLogger(ReportMigrationHandler.class);

    private final String DEFAULT_SYSTEM_TEMPLATES_PATH = "report-service/src/main/resources/system_templates";

    private final FileService fileService;
    private final TemplateService templateService;

    public ReportMigrationHandler(FileService fileService,
                                  TemplateService templateService) {
        this.fileService = fileService;
        this.templateService = templateService;
    }

    /**
     * Выполняет миграцию системных шаблонов отчётов.
     *
     * <p>Синхронизирует шаблоны из директории system_templates с базой данных:
     * создаёт новые, обновляет существующие и удаляет устаревшие системные шаблоны.
     *
     * <p>Если в директории system_templates не найдено JSON-файлов, миграция пропускается.
     * Ошибки при работе с БД логируются, но не останавливают выполнение приложения.
     */
    public void handle() {
        try {
            log.info("*** Handle migrations ***");

            List<File> systemTemplatesDescription = fileService.getFilesByPathWithPattern(DEFAULT_SYSTEM_TEMPLATES_PATH,
                                                                                          Pattern.compile(".*\\.json"));
            if (systemTemplatesDescription.isEmpty()) {
                log.warn("По пути {} не найдено ни 1 файла формата .json", DEFAULT_SYSTEM_TEMPLATES_PATH);

                return;
            }

            Map<String, JsonNode> systemSchemas = new HashMap<>();
            systemTemplatesDescription.forEach(file -> {
                try {
                    JsonNode jsonNode = readTreeFromFile(file);
                    if (jsonNode == null || !jsonNode.has("name")) {
                        log.warn("Файл {} не содержит необходимые поля", file.getName());

                        return;
                    }
                    String templateName = jsonNode.get("name").asText();
                    systemSchemas.put(templateName, jsonNode);

                    log.debug("Прочитан шаблон: {}", templateName);
                } catch (Exception e) {
                    log.error("Ошибка чтения файла {}: {}", file.getName(), e.getMessage());
                }
            });

            Set<String> existNamesSet = templateService.getSystemTemplates()
                                                       .stream()
                                                       .map(Template::getName)
                                                       .collect(Collectors.toSet());

            divideAndConquer(systemSchemas, existNamesSet);

            log.info("*** Миграции сервиса шаблонов успешно выполнены ***");
        } catch (DataAccessException e) {
            log.error("Ошибка миграции шаблонов: {}", e.getMessage());
        }
    }

    private void divideAndConquer(Map<String, JsonNode> systemSchemas,
                                  Set<String> existNames) {
        Set<String> schemaNames = systemSchemas.keySet();
        // 1. Шаблоны для создания (есть в мапе, но нет в базе)
        Set<String> templatesToCreate = schemaNames.stream()
                                                   .filter(name -> !existNames.contains(name))
                                                   .collect(Collectors.toSet());

        // 2. Шаблоны для обновления (есть и в мапе, и в базе)
        Set<String> templatesToUpdate = schemaNames.stream()
                                                   .filter(existNames::contains)
                                                   .collect(Collectors.toSet());

        // 3. Шаблоны для удаления (есть в базе, но нет в мапе)
        Set<String> templatesToDelete = existNames.stream()
                                                  .filter(name -> !schemaNames.contains(name))
                                                  .collect(Collectors.toSet());

        log.info("Шаблонов для создания: {}", templatesToCreate.size());
        log.info("Шаблонов для обновления: {}", templatesToUpdate.size());
        log.info("Шаблонов для удаления: {}", templatesToDelete.size());

        if (!templatesToDelete.isEmpty()) {
            templateService.deleteTemplates(templatesToDelete);
        }

        if (!templatesToCreate.isEmpty()) {
            createNewTemplates(templatesToCreate, systemSchemas);
        }

        if (!templatesToUpdate.isEmpty()) {
            updateTemplates(templatesToUpdate, systemSchemas);
        }
    }

    private void createNewTemplates(Set<String> templates,
                                    Map<String, JsonNode> systemSchemas) {
        for (String template: templates) {
            try {
                List<File> templateFiles = fileService.getFilesByPathWithPattern(
                        DEFAULT_SYSTEM_TEMPLATES_PATH,
                        Pattern.compile(template + "\\.(?!json$).*"));

                String path = fileService.copyFileByPathInMainStorage(templateFiles.getFirst().getPath());

                Optional<TemplateCreateDto> oTemplateSchema = fromJson(systemSchemas.get(template).toString(),
                                                                       TemplateCreateDto.class);
                oTemplateSchema.ifPresentOrElse(
                        templateCreateDto -> insertTemplate(templateCreateDto, path),
                        () -> log.error("Для {} пустая схема. Невозможно сделать вставку в базу!", template));

                log.info("Создан новый шаблон: {}", template);
            } catch (Exception e) {
                log.error("Ошибка создания шаблона {}: {}", template, e.getMessage());
            }
        }
    }

    private void insertTemplate(TemplateCreateDto templateCreateDto, String path) {
        String title = (templateCreateDto.getTitle() == null || templateCreateDto.getTitle().isEmpty())
                ? "default value"
                : templateCreateDto.getTitle();
        templateCreateDto.setTitle(title);

        Template template = new Template(templateCreateDto, path, "SYSTEM", now(), true);

        templateService.save(template);

        log.debug("Вставлена запись в БД для шаблона: {}", templateCreateDto.getName());
    }

    private void updateTemplates(Set<String> templatesToUpdate,
                                 Map<String, JsonNode> systemSchemas) {
        templateService.deleteTemplates(templatesToUpdate);
        createNewTemplates(templatesToUpdate, systemSchemas);
    }
}
