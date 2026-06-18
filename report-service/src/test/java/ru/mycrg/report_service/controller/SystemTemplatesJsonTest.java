package ru.mycrg.report_service.controller;

import org.junit.jupiter.api.Test;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static ru.mycrg.report_service.services.migrations.dao.ReportMigrationHandler.TEMPLATE_REQUIRED_FIELD;

class SystemTemplatesJsonTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Test
    void systemTemplateJsonFiles_shouldBeValidJson() throws IOException {
        Path templatesDir = resolveTemplatesDir();
        List<Path> jsonFiles = findJsonFiles(templatesDir);
        List<String> invalidJsonFiles = new ArrayList<>();

        assertThat(jsonFiles)
                .as("JSON template files in %s", templatesDir)
                .isNotEmpty();

        for (Path jsonFile: jsonFiles) {
            try {
                OBJECT_MAPPER.readTree(jsonFile.toFile());
            } catch (Exception e) {
                invalidJsonFiles.add(jsonFile.getFileName() + ": " + e.getMessage());
            }
        }

        assertThat(invalidJsonFiles)
                .as("Invalid JSON files in %s", templatesDir)
                .isEmpty();
    }

    @Test
    void systemTemplateJsonFiles_shouldContainNameField() throws IOException {
        Path templatesDir = resolveTemplatesDir();
        List<Path> jsonFiles = findJsonFiles(templatesDir);
        List<String> filesWithoutName = new ArrayList<>();

        assertThat(jsonFiles)
                .as("JSON template files in %s", templatesDir)
                .isNotEmpty();

        for (Path jsonFile: jsonFiles) {
            JsonNode template = OBJECT_MAPPER.readTree(jsonFile.toFile());
            if (template == null || !template.has(TEMPLATE_REQUIRED_FIELD)) {
                filesWithoutName.add(jsonFile.getFileName().toString());
            }
        }

        assertThat(filesWithoutName)
                .as("System template JSON files without required field '%s' in %s",
                    TEMPLATE_REQUIRED_FIELD, templatesDir)
                .isEmpty();
    }

    private static Path resolveTemplatesDir() {
        Path moduleTemplatesDir = Path.of("src/main/resources/system_templates");
        if (Files.isDirectory(moduleTemplatesDir)) {
            return moduleTemplatesDir;
        }

        return Path.of("report-service/src/main/resources/system_templates");
    }

    private static List<Path> findJsonFiles(Path templatesDir) throws IOException {
        assertThat(templatesDir)
                .as("System templates directory")
                .isDirectory();

        try (Stream<Path> files = Files.list(templatesDir)) {
            return files
                    .filter(Files::isRegularFile)
                    .filter(file -> file.getFileName().toString().endsWith(".json"))
                    .sorted(Comparator.comparing(file -> file.getFileName().toString()))
                    .toList();
        }
    }
}
