package ru.mycrg.data_service.service.schemas;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dao.migrations.SchemaSystemMigrationHandler;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

class SystemSchemasJsonValidationTest {

    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();
    private static final Logger VALIDATOR_LOGGER =
            (Logger) LoggerFactory.getLogger(SchemaLogicValidator.class);

    private final SchemaLogicValidator validator = new SchemaLogicValidator();

    @Test
    void systemSchemaJsonFiles_shouldBeValidAndPassSchemaLogicValidator() throws IOException {
        Path schemasDir = resolveSchemasDir();
        List<Path> jsonFiles = findJsonFiles(schemasDir);

        assertThat(jsonFiles)
                .as("JSON schema files in %s", schemasDir)
                .isNotEmpty();

        List<String> failures = new ArrayList<>();
        Map<String, Path> namesToFiles = new HashMap<>();
        Level originalLevel = VALIDATOR_LOGGER.getLevel();

        try {
            VALIDATOR_LOGGER.setLevel(Level.ERROR);

            for (Path jsonFile: jsonFiles) {
                String relativePath = schemasDir.relativize(jsonFile).toString();
                JsonNode tree;
                try {
                    tree = JSON_MAPPER.readTree(jsonFile.toFile());
                } catch (Exception e) {
                    failures.add(relativePath + ": невалидный JSON: " + e.getMessage());
                    continue;
                }

                if (tree == null || !tree.has(SchemaSystemMigrationHandler.SCHEMA_REQUIRED_FIELD)) {
                    failures.add(relativePath
                                         + ": отсутствует обязательное поле '"
                                         + SchemaSystemMigrationHandler.SCHEMA_REQUIRED_FIELD + "'");
                    continue;
                }

                SchemaDto schema;
                try {
                    schema = JSON_MAPPER.readValue(jsonFile.toFile(), SchemaDto.class);
                } catch (JacksonException e) {
                    failures.add(relativePath + ": ошибка десериализации SchemaDto: " + e.getMessage());
                    continue;
                }

                Path previous = namesToFiles.put(schema.getName(), jsonFile);
                if (previous != null) {
                    failures.add("Дубликат имени схемы '%s': %s и %s"
                                         .formatted(schema.getName(),
                                                    schemasDir.relativize(previous),
                                                    relativePath));
                }

                try {
                    Set<ErrorInfo> errors = validator.validate(schema);
                    if (!errors.isEmpty()) {
                        failures.add(relativePath + " (" + schema.getName() + "): " + errors);
                    }
                } catch (Exception e) {
                    failures.add(relativePath + ": ошибка валидации: " + e.getMessage());
                }
            }
        } finally {
            VALIDATOR_LOGGER.setLevel(originalLevel);
        }

        assertThat(failures)
                .as("Ошибки в system_schemas")
                .isEmpty();
    }

    private static Path resolveSchemasDir() {
        Path moduleDir = Path.of("src/main/resources/system_schemas");
        if (Files.isDirectory(moduleDir)) {
            return moduleDir;
        }

        return Path.of("data-service/src/main/resources/system_schemas");
    }

    private static List<Path> findJsonFiles(Path schemasDir) throws IOException {
        assertThat(schemasDir)
                .as("System schemas directory")
                .isDirectory();

        try (Stream<Path> files = Files.walk(schemasDir)) {
            return files
                    .filter(Files::isRegularFile)
                    .filter(file -> file.getFileName().toString().endsWith(".json"))
                    .sorted(Comparator.comparing(file -> schemasDir.relativize(file).toString()))
                    .toList();
        }
    }
}
