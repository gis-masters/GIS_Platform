package ru.mycrg.data_service.dao.migrations;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.http_client.JsonConverter.fromJson;

@Service
public class SchemaSystemMigrationHandler {

    public static final String SCHEMA_REQUIRED_FIELD = "name";

    private static final Logger log = LoggerFactory.getLogger(SchemaSystemMigrationHandler.class);
    private static final String SYSTEM_SCHEMAS_CLASSPATH = "classpath:system_schemas/**/*.json";
    private static final String SYSTEM_USER = "SYSTEM";

    private final ApplicationContext ctx;

    public SchemaSystemMigrationHandler(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    /**
     * Синхронизирует системные шаблоны схем из JSON с таблицей data.schemas.
     *
     * <p>Создаёт новые, обновляет существующие (только from_json = true) и удаляет
     * устаревшие записи с from_json = true. Если в БД уже есть схема с тем же именем
     * и from_json = false, синхронизация прерывается с ошибкой.
     *
     * <p>При пустом каталоге JSON delete не выполняется (защита от сбоя чтения ресурсов).
     */
    public void sync(Connection connection) {
        try {
            log.info("*** Синхронизация системных схем из JSON ***");

            Resource[] resources = ctx.getResources(SYSTEM_SCHEMAS_CLASSPATH);
            Map<String, String> systemSchemas = readSystemSchemas(resources);

            if (systemSchemas.isEmpty()) {
                log.warn("По пути {} не найдено ни одного файла формата .json", SYSTEM_SCHEMAS_CLASSPATH);

                return;
            }

            Map<String, Boolean> existingSchemas = loadExistingSchemas(connection);
            applySchemasDiff(connection, systemSchemas, existingSchemas);

            log.info("*** Синхронизация системных схем из JSON успешно выполнена ***");
        } catch (DataServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new DataServiceException(
                    "Ошибка синхронизации системных схем из JSON: " + e.getMessage(), e);
        }
    }

    private Map<String, String> readSystemSchemas(Resource[] resources) {
        Map<String, String> systemSchemas = new HashMap<>();

        Arrays.stream(resources)
              .filter(resource -> isJsonFile(resource.getFilename()))
              .forEach(resource -> {
                  try {
                      String content = StreamUtils.copyToString(resource.getInputStream(),
                                                                StandardCharsets.UTF_8);
                      SchemaDto schema = fromJson(content, SchemaDto.class)
                              .orElseThrow(() -> new IllegalStateException(
                                      "Не удалось разобрать схему из файла: " + resource.getFilename()));

                      if (schema.getName() == null || schema.getName().isBlank()) {
                          throw new IllegalStateException(
                                  "В файле %s отсутствует обязательное поле '%s'"
                                          .formatted(resource.getFilename(), SCHEMA_REQUIRED_FIELD));
                      }

                      String schemaName = schema.getName();
                      if (systemSchemas.containsKey(schemaName)) {
                          throw new DataServiceException(
                                  "Дубликат имени схемы '%s' в файле %s: такое имя уже прочитано из другого JSON"
                                          .formatted(schemaName, resource.getFilename()));
                      }

                      systemSchemas.put(schemaName, content);
                      log.debug("Прочитана схема: {}", schemaName);
                  } catch (DataServiceException e) {
                      throw e;
                  } catch (Exception e) {
                      throw new DataServiceException(
                              "Не удалось прочитать системную схему из файла: " + resource.getFilename()
                                      + ". По причине: " + e.getMessage(), e);
                  }
              });

        return systemSchemas;
    }

    private Map<String, Boolean> loadExistingSchemas(Connection connection) throws Exception {
        Map<String, Boolean> existing = new HashMap<>();
        String query = "SELECT name, COALESCE(from_json, false) AS from_json FROM data.schemas";

        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                existing.put(resultSet.getString("name"), resultSet.getBoolean("from_json"));
            }
        }

        return existing;
    }

    private void applySchemasDiff(Connection connection,
                                  Map<String, String> systemSchemas,
                                  Map<String, Boolean> existingSchemas) throws Exception {
        Set<String> jsonNames = systemSchemas.keySet();
        Set<String> existingNames = existingSchemas.keySet();

        Set<String> schemasToCreate = jsonNames.stream()
                                               .filter(name -> !existingNames.contains(name))
                                               .collect(Collectors.toSet());

        Set<String> schemasToUpdate = new HashSet<>();
        for (String name: jsonNames) {
            if (!existingNames.contains(name)) {
                continue;
            }

            if (!Boolean.TRUE.equals(existingSchemas.get(name))) {
                throw new DataServiceException(
                        ("Схема '%s' уже существует в БД и не управляется из JSON (from_json = false). "
                                + "Переименуйте JSON-схему или добавьте имя в M21__markJsonManagedSchemas.sql")
                                .formatted(name));
            }

            schemasToUpdate.add(name);
        }

        Set<String> schemasToDelete = existingSchemas.entrySet().stream()
                                                     .filter(entry -> Boolean.TRUE.equals(entry.getValue()))
                                                     .map(Map.Entry::getKey)
                                                     .filter(name -> !jsonNames.contains(name))
                                                     .collect(Collectors.toCollection(HashSet::new));

        log.info("Схем для создания: {}", schemasToCreate.size());
        log.info("Схем-кандидатов на обновление: {}", schemasToUpdate.size());
        log.info("Схем для удаления: {}", schemasToDelete.size());

        for (String name: schemasToDelete) {
            deleteSchema(connection, name);
        }

        for (String name: schemasToCreate) {
            insertSchema(connection, name, systemSchemas.get(name));
        }

        int updated = 0;
        int skipped = 0;
        for (String name: schemasToUpdate) {
            if (updateSchemaIfChanged(connection, name, systemSchemas.get(name))) {
                updated++;
            } else {
                skipped++;
            }
        }

        log.info("Схем обновлено: {}, без изменений (пропущено): {}", updated, skipped);
    }

    private void insertSchema(Connection connection, String name, String classRuleJson) throws Exception {
        String sql = """
                INSERT INTO data.schemas
                    (name, class_rule, is_system, from_json, created_by, created_at, modified_by, last_modified)
                VALUES (?, ?::json, true, true, ?, ?, ?, ?)
                """;

        LocalDateTime now = LocalDateTime.now();

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, name);
            statement.setString(2, classRuleJson);
            statement.setString(3, SYSTEM_USER);
            statement.setTimestamp(4, Timestamp.valueOf(now));
            statement.setString(5, SYSTEM_USER);
            statement.setTimestamp(6, Timestamp.valueOf(now));
            statement.executeUpdate();
        }

        log.info("Создана системная схема: {}", name);
    }

    /**
     * Обновляет схему только если изменился class_rule или флаг is_system.
     *
     * @return true если запись была обновлена
     */
    private boolean updateSchemaIfChanged(Connection connection, String name, String classRuleJson) throws Exception {
        String sql = """
                UPDATE data.schemas
                SET class_rule = ?::json,
                    is_system = true,
                    from_json = true,
                    modified_by = ?,
                    last_modified = ?
                WHERE name = ?
                  AND (
                    class_rule::jsonb IS DISTINCT FROM ?::jsonb
                    OR COALESCE(is_system, false) = false
                  )
                """;

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, classRuleJson);
            statement.setString(2, SYSTEM_USER);
            statement.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now()));
            statement.setString(4, name);
            statement.setString(5, classRuleJson);
            int rows = statement.executeUpdate();
            if (rows > 0) {
                log.info("Обновлена системная схема: {}", name);

                return true;
            }

            log.debug("Схема без изменений, пропуск: {}", name);

            return false;
        }
    }

    private void deleteSchema(Connection connection, String name) throws Exception {
        String sql = "DELETE FROM data.schemas WHERE name = ? AND from_json = true";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, name);
            int rows = statement.executeUpdate();
            if (rows > 0) {
                log.info("Удалена системная схема из JSON: {}", name);
            }
        }
    }

    private boolean isJsonFile(String fileName) {
        return fileName != null && fileName.endsWith(".json");
    }
}
