package ru.mycrg.report_service.services.migrations.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.report_service.TemplateCreateDto;
import ru.mycrg.report_service.entity.Template;
import ru.mycrg.report_service.services.FileService;
import ru.mycrg.report_service.services.TemplateService;
import tools.jackson.databind.JsonNode;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.http_client.JsonConverter.readTreeFromFile;

@Service
public class ReportMigrationHandler {

    public static final String TEMPLATE_REQUIRED_FIELD = "name";

    private static final Logger log = LoggerFactory.getLogger(ReportMigrationHandler.class);

    private static final String DEFAULT_SYSTEM_TEMPLATES_PATH = "report-service/src/main/resources/system_templates";

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
     * <p>Любая ошибка миграции прерывает запуск приложения.
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

                JsonNode jsonNode = readTreeFromFile(file);
                String templateName = jsonNode.get(TEMPLATE_REQUIRED_FIELD).asText();
                systemSchemas.put(templateName, jsonNode);

                log.debug("Прочитан шаблон: {}", templateName);
            });

            List<Template> allTemplates = templateService.getTemplates();

            divideAndConquer(systemSchemas, allTemplates);

            log.info("*** Миграции сервиса шаблонов успешно выполнены ***");
        } catch (RuntimeException e) {
            log.error("Ошибка миграции системных шаблонов", e);

            throw e;
        }
    }

    private void divideAndConquer(Map<String, JsonNode> systemSchemas,
                                  List<Template> existTemplates) {
        Set<String> schemaNames = systemSchemas.keySet();
        Set<String> existingNames = existTemplates.stream()
                                                  .map(Template::getName)
                                                  .collect(Collectors.toSet());

        // 1. Шаблоны для создания (есть в мапе, но нет в базе)
        Set<String> templatesToCreate = systemSchemas.keySet().stream()
                                                     .filter(name -> !existingNames.contains(name))
                                                     .collect(Collectors.toSet());

        // 2. Шаблоны для обновления (есть и в мапе, и в базе)
        Set<String> templatesToUpdate = schemaNames.stream()
                                                   .filter(existingNames::contains)
                                                   .collect(Collectors.toSet());

        // 3. Системные шаблоны для удаления (есть в базе, но нет в мапе)
        Set<String> templatesToDelete = existTemplates.stream()
                                                      .filter(Template::isSystem)
                                                      .map(Template::getName)
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

                TemplateCreateDto templateSchema = fromJson(systemSchemas.get(template).toString(),
                                                            TemplateCreateDto.class)
                        .orElseThrow(() -> new IllegalStateException(
                                "Для %s пустая схема. Невозможно сделать вставку в базу".formatted(template)));
                insertTemplate(templateSchema, path, extractHidden(systemSchemas.get(template)));

                log.info("Создан новый шаблон: {}", template);
            } catch (Exception e) {
                throw new IllegalStateException(
                        "Ошибка создания системного шаблона " + template, e);
            }
        }
    }

    private void insertTemplate(TemplateCreateDto templateCreateDto, String path, boolean hidden) {
        String title = (templateCreateDto.getTitle() == null || templateCreateDto.getTitle().isEmpty())
                ? "default value"
                : templateCreateDto.getTitle();
        templateCreateDto.setTitle(title);

        templateService.createSystemTemplate(templateCreateDto, path, hidden);

        log.debug("Вставлена запись в БД для шаблона: {}", templateCreateDto.getName());
    }

    private boolean extractHidden(JsonNode schema) {
        if (schema == null) {
            return false;
        }

        JsonNode hiddenNode = schema.has("hidden")
                ? schema.get("hidden")
                : schema.get("Hidden");

        return hiddenNode != null && hiddenNode.asBoolean(false);
    }

    private void updateTemplates(Set<String> templatesToUpdate,
                                 Map<String, JsonNode> systemSchemas) {
        templateService.deleteTemplates(templatesToUpdate);
        createNewTemplates(templatesToUpdate, systemSchemas);
    }
}
