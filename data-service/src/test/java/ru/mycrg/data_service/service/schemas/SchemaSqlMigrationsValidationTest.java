package ru.mycrg.data_service.service.schemas;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JacksonException.Reference;
import tools.jackson.core.TokenStreamLocation;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Deque;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SchemaSqlMigrationsValidationTest {

    private static final Path SCHEMAS_DIR = Paths.get("src/main/resources/sql/schemas");
    private static final Pattern UPDATE_SCHEMA_PATTERN =
            Pattern.compile("(?im)^\\s*UPDATE\\s+data\\.schemas\\b");
    private static final Pattern CLASS_RULE_PATTERN =
            Pattern.compile("(?is)\\bclass_rule\\b\\s*=\\s*");
    private static final Pattern WHERE_NAME_PATTERN =
            Pattern.compile("(?is)\\bWHERE\\s+name\\s*=\\s*'((?:''|[^'])*)'");
    private static final Pattern JSON_NAME_PATTERN =
            Pattern.compile("(?is)\"name\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
    private static final Logger VALIDATOR_LOGGER =
            (Logger) LoggerFactory.getLogger(SchemaSqlMigrationsValidationTest.class);
    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();

    private final SchemaLogicValidator validator = new SchemaLogicValidator();

    @Test
    void allSchemaSqlUpdatesMustPassSchemaLogicValidator() throws IOException {
        List<SchemaSqlUpdate> updates = collectSchemaUpdates();

        assertFalse(updates.isEmpty(),
                    "Не найдено ни одного UPDATE data.schemas с полем class_rule в " + SCHEMAS_DIR);

        List<String> failures = new ArrayList<>();
        Level originalLevel = VALIDATOR_LOGGER.getLevel();

        try {
            VALIDATOR_LOGGER.setLevel(Level.ERROR);

            for (SchemaSqlUpdate update: updates) {
                SchemaDto schema;
                try {
                    schema = JSON_MAPPER.readValue(update.classRuleJson(), SchemaDto.class);
                } catch (JacksonException e) {
                    failures.add(formatJsonParsingError(update, e));
                    continue;
                }

                try {
                    Set<ErrorInfo> errors = validator.validate(schema);
                    if (!errors.isEmpty()) {
                        failures.add(update.describe(schema.getName()) + System.lineSeparator()
                                             + formatErrors(errors));
                    }
                } catch (Exception e) {
                    failures.add(update.describe(schema.getName()) + System.lineSeparator()
                                         + "  Ошибка валидации: " + e.getMessage());
                }
            }
        } finally {
            VALIDATOR_LOGGER.setLevel(originalLevel);
        }

        assertTrue(failures.isEmpty(),
                   "Найдены схемы из SQL-миграций, не проходящие SchemaLogicValidator:"
                           + System.lineSeparator()
                           + System.lineSeparator()
                           + String.join(System.lineSeparator() + System.lineSeparator(), failures));
    }

    private List<SchemaSqlUpdate> collectSchemaUpdates() throws IOException {
        List<SchemaSqlUpdate> updates = new ArrayList<>();

        try (Stream<Path> paths = Files.walk(SCHEMAS_DIR, 1)) {
            List<Path> files = paths.filter(Files::isRegularFile)
                                    .sorted()
                                    .toList();

            for (Path file: files) {
                updates.addAll(extractUpdates(file));
            }
        }

        return updates;
    }

    private List<SchemaSqlUpdate> extractUpdates(Path file) throws IOException {
        String content = Files.readString(file, StandardCharsets.UTF_8);
        Matcher matcher = UPDATE_SCHEMA_PATTERN.matcher(content);
        List<SchemaSqlUpdate> updates = new ArrayList<>();

        while (matcher.find()) {
            int statementStart = matcher.start();
            int statementEnd = findStatementEnd(content, statementStart);
            String statement = content.substring(statementStart, statementEnd);

            Matcher classRuleMatcher = CLASS_RULE_PATTERN.matcher(statement);
            if (!classRuleMatcher.find()) {
                continue;
            }

            int valueStart = findNextNonWhitespace(statement, classRuleMatcher.end());
            if (valueStart >= statement.length() || statement.charAt(valueStart) != '\'') {
                throw new IllegalStateException("Не удалось найти начало SQL-строки class_rule в файле: " + file);
            }

            SqlStringLiteral classRule = readSqlStringLiteral(statement, valueStart);
            updates.add(new SchemaSqlUpdate(file,
                                            extractSchemaNameFromWhere(statement),
                                            classRule.value()));
        }

        return updates;
    }

    private int findStatementEnd(String sql, int startIndex) {
        boolean inString = false;
        boolean inLineComment = false;
        boolean inBlockComment = false;

        for (int i = startIndex; i < sql.length(); i++) {
            char current = sql.charAt(i);
            char next = i + 1 < sql.length() ? sql.charAt(i + 1) : '\0';

            if (inLineComment) {
                if (current == '\n') {
                    inLineComment = false;
                }

                continue;
            }

            if (inBlockComment) {
                if (current == '*' && next == '/') {
                    inBlockComment = false;
                    i++;
                }

                continue;
            }

            if (inString) {
                if (current == '\'') {
                    if (next == '\'') {
                        i++;
                    } else {
                        inString = false;
                    }
                }

                continue;
            }

            if (current == '-' && next == '-') {
                inLineComment = true;
                i++;

                continue;
            }

            if (current == '/' && next == '*') {
                inBlockComment = true;
                i++;

                continue;
            }

            if (current == '\'') {
                inString = true;

                continue;
            }

            if (current == ';') {
                return i;
            }
        }

        return sql.length();
    }

    private int findNextNonWhitespace(String text, int index) {
        int current = index;
        while (current < text.length() && Character.isWhitespace(text.charAt(current))) {
            current++;
        }

        return current;
    }

    private SqlStringLiteral readSqlStringLiteral(String text, int startQuoteIndex) {
        StringBuilder value = new StringBuilder();

        for (int i = startQuoteIndex + 1; i < text.length(); i++) {
            char current = text.charAt(i);

            if (current == '\'') {
                if (i + 1 < text.length() && text.charAt(i + 1) == '\'') {
                    value.append('\'');
                    i++;
                } else {
                    return new SqlStringLiteral(value.toString(), i);
                }
            } else {
                value.append(current);
            }
        }

        throw new IllegalStateException("Не удалось дочитать SQL-строку до конца");
    }

    private String extractSchemaNameFromWhere(String statement) {
        Matcher matcher = WHERE_NAME_PATTERN.matcher(statement);
        if (!matcher.find()) {
            return null;
        }

        return matcher.group(1).replace("''", "'");
    }

    private String formatErrors(Set<ErrorInfo> errors) {
        return errors.stream()
                     .sorted(Comparator.comparing(ErrorInfo::getField,
                                                  Comparator.nullsFirst(String::compareTo))
                                       .thenComparing(ErrorInfo::getMessage,
                                                      Comparator.nullsFirst(String::compareTo)))
                     .map(this::formatError)
                     .collect(Collectors.joining(System.lineSeparator()));
    }

    private String formatError(ErrorInfo error) {
        if (error.getField() == null || error.getField().isBlank()) {
            return "  " + error.getMessage();
        }

        return "  " + error.getField() + ": " + error.getMessage();
    }

    private String formatJsonParsingError(SchemaSqlUpdate update, JacksonException e) {
        StringBuilder message = new StringBuilder(update.describe())
                .append(System.lineSeparator())
                .append("  Ошибка JSON в поле class_rule: ")
                .append(describeJsonParsingProblem(e));

        String jsonPath = formatJsonPath(e);
        if (!jsonPath.isBlank()) {
            message.append(System.lineSeparator())
                   .append("  Место по структуре JSON: ")
                   .append(jsonPath);
        }

        TokenStreamLocation location = e.getLocation();
        if (location != null && location.getLineNr() > 0 && location.getColumnNr() > 0) {
            message.append(System.lineSeparator())
                   .append("  Позиция внутри class_rule: строка ")
                   .append(location.getLineNr())
                   .append(", колонка ")
                   .append(location.getColumnNr());
        }

        if (isObjectTrailingCommaError(e)) {
            Integer trailingCommaIndex = findTrailingCommaBeforeObjectEnd(update.classRuleJson());
            if (trailingCommaIndex != null) {
                addTrailingCommaHint(message, update.classRuleJson(), trailingCommaIndex);
            }
        }

        return message.toString();
    }

    private String describeJsonParsingProblem(JacksonException e) {
        String originalMessage = e.getOriginalMessage();
        if (originalMessage == null || originalMessage.isBlank()) {
            originalMessage = e.getMessage();
        }

        if (isObjectTrailingCommaError(originalMessage)) {
            return "после запятой ожидалось имя следующего поля, но объект уже закрывается. "
                    + "Обычно это лишняя запятая перед '}'.";
        }

        return originalMessage == null ? "парсер не вернул подробное сообщение" : originalMessage;
    }

    private boolean isObjectTrailingCommaError(JacksonException e) {
        return isObjectTrailingCommaError(e.getOriginalMessage());
    }

    private boolean isObjectTrailingCommaError(String originalMessage) {
        return originalMessage != null
                && originalMessage.contains("Unexpected character ('}'")
                && originalMessage.contains("was expecting double-quote to start property name");
    }

    private String formatJsonPath(JacksonException e) {
        List<Reference> path = e.getPath();
        if (path == null || path.isEmpty()) {
            return "";
        }

        StringBuilder result = new StringBuilder();
        for (Reference reference: path) {
            if (reference.getPropertyName() != null) {
                if (!result.isEmpty()) {
                    result.append('.');
                }

                result.append(reference.getPropertyName());
            }

            if (reference.getIndex() >= 0) {
                result.append('[').append(reference.getIndex()).append(']');
            }
        }

        return result.toString();
    }

    private Integer findTrailingCommaBeforeObjectEnd(String json) {
        boolean inString = false;
        boolean escaped = false;

        for (int i = 0; i < json.length(); i++) {
            char current = json.charAt(i);

            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (current == '\\') {
                    escaped = true;
                } else if (current == '"') {
                    inString = false;
                }

                continue;
            }

            if (current == '"') {
                inString = true;

                continue;
            }

            if (current == ',') {
                int nextNonWhitespace = findNextNonWhitespace(json, i + 1);
                if (nextNonWhitespace < json.length() && json.charAt(nextNonWhitespace) == '}') {
                    return i;
                }
            }
        }

        return null;
    }

    private void addTrailingCommaHint(StringBuilder message, String json, int trailingCommaIndex) {
        int objectStart = findEnclosingObjectStart(json, trailingCommaIndex);
        int objectEnd = objectStart < 0 ? -1 : findMatchingObjectEnd(json, objectStart);
        String objectJson = objectStart < 0
                ? ""
                : json.substring(objectStart, objectEnd < 0 ? trailingCommaIndex + 1 : objectEnd + 1);
        String propertyName = extractJsonName(objectJson);

        if (!propertyName.isBlank()) {
            message.append(System.lineSeparator())
                   .append("  Свойство рядом с ошибкой: ")
                   .append(propertyName);
        }

        message.append(System.lineSeparator())
               .append("  Что исправить: убрать запятую после последнего поля объекта.");

        List<String> fragment = formatJsonFragment(json, objectStart, objectEnd, trailingCommaIndex);
        if (!fragment.isEmpty()) {
            message.append(System.lineSeparator())
                   .append("  Фрагмент class_rule:")
                   .append(System.lineSeparator())
                   .append(String.join(System.lineSeparator(), fragment));
        }
    }

    private int findEnclosingObjectStart(String json, int index) {
        Deque<Integer> objectStarts = new ArrayDeque<>();
        boolean inString = false;
        boolean escaped = false;

        for (int i = 0; i < index; i++) {
            char current = json.charAt(i);

            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (current == '\\') {
                    escaped = true;
                } else if (current == '"') {
                    inString = false;
                }

                continue;
            }

            if (current == '"') {
                inString = true;
            } else if (current == '{') {
                objectStarts.push(i);
            } else if (current == '}' && !objectStarts.isEmpty()) {
                objectStarts.pop();
            }
        }

        return objectStarts.isEmpty() ? -1 : objectStarts.peek();
    }

    private int findMatchingObjectEnd(String json, int objectStart) {
        int depth = 0;
        boolean inString = false;
        boolean escaped = false;

        for (int i = objectStart; i < json.length(); i++) {
            char current = json.charAt(i);

            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (current == '\\') {
                    escaped = true;
                } else if (current == '"') {
                    inString = false;
                }

                continue;
            }

            if (current == '"') {
                inString = true;
            } else if (current == '{') {
                depth++;
            } else if (current == '}') {
                depth--;
                if (depth == 0) {
                    return i;
                }
            }
        }

        return -1;
    }

    private String extractJsonName(String objectJson) {
        Matcher matcher = JSON_NAME_PATTERN.matcher(objectJson);
        if (!matcher.find()) {
            return "";
        }

        return matcher.group(1)
                      .replace("\\\"", "\"")
                      .replace("\\\\", "\\");
    }

    private List<String> formatJsonFragment(String json, int objectStart, int objectEnd, int markerIndex) {
        if (objectStart < 0 || objectEnd < 0) {
            return List.of();
        }

        int start = findLineStart(json, objectStart);
        int end = findLineEnd(json, objectEnd);
        List<String> result = new ArrayList<>();
        int lineStart = start;

        while (lineStart <= end) {
            int lineEnd = findLineEnd(json, lineStart);
            String line = json.substring(lineStart, Math.min(lineEnd, json.length()));
            result.add("    " + line);

            if (markerIndex >= lineStart && markerIndex < lineEnd) {
                int markerColumn = markerIndex - lineStart;
                result.add("    " + " ".repeat(markerColumn) + "^ лишняя запятая");
            }

            if (lineEnd >= json.length()) {
                break;
            }

            lineStart = lineEnd + 1;
        }

        return result;
    }

    private int findLineStart(String text, int index) {
        int current = Math.min(index, text.length() - 1);
        while (current > 0 && text.charAt(current - 1) != '\n' && text.charAt(current - 1) != '\r') {
            current--;
        }

        return current;
    }

    private int findLineEnd(String text, int index) {
        int current = Math.max(index, 0);
        while (current < text.length() && text.charAt(current) != '\n' && text.charAt(current) != '\r') {
            current++;
        }

        return current;
    }

    private record SchemaSqlUpdate(Path file, String whereName, String classRuleJson) {

        private String describe() {
                return describe(whereName);
            }

            private String describe(String schemaName) {
                StringBuilder description = new StringBuilder("Файл: ")
                        .append(file.getFileName());

                if (schemaName != null && !schemaName.isBlank()) {
                    description.append(". Схема: ").append(schemaName);
                }

                return description.toString();
            }
        }

    private record SqlStringLiteral(String value, int endQuoteIndex) {
        }
}
