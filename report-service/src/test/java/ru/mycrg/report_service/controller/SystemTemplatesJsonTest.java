package ru.mycrg.report_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

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

        for (Path jsonFile : jsonFiles) {
            try {
                OBJECT_MAPPER.readTree(jsonFile.toFile());
            } catch (JsonProcessingException e) {
                invalidJsonFiles.add(jsonFile.getFileName() + ": " + e.getOriginalMessage());
            } catch (IOException e) {
                invalidJsonFiles.add(jsonFile.getFileName() + ": " + e.getMessage());
            }
        }

        assertThat(invalidJsonFiles)
                .as("Invalid JSON files in %s", templatesDir)
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
