package ru.mycrg.data_service.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.mappers.SchemasAndTablesShortMapper;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.Optional;

@Repository
public class SchemasAndTablesRepositoryDetached {

    private final Logger log = LoggerFactory.getLogger(SchemasAndTablesRepositoryDetached.class);

    //TODO: вынести или реиспользовать schemas_and_tables как переменную
    public Optional<SchemasAndTables> findByIdentifier(JdbcTemplate jdbcTemplate, String identifier) {
        String sql = "SELECT id, identifier, path, schema, title, crs FROM schemas_and_tables WHERE identifier = ?";

        try {
            SchemasAndTables result = jdbcTemplate.queryForObject(sql, new SchemasAndTablesShortMapper(), identifier);

            return Optional.ofNullable(result);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void save(JdbcTemplate jdbcTemplate, SchemasAndTables entity) {
        String sql = "INSERT INTO schemas_and_tables " +
                "(title, details, is_folder, identifier, path, crs, schema, created_at, last_modified) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?::jsonb, ?, ?)";

        jdbcTemplate.update(sql,
                            entity.getTitle(),
                            entity.getDetails(),
                            entity.isFolder(),
                            entity.getIdentifier(),
                            entity.getPath(),
                            entity.getCrs(),
                            entity.getSchema() != null ? entity.getSchema().toString() : null,
                            entity.getCreatedAt(),
                            entity.getLastModified()
        );
    }

    /**
     * Выполняет фильтрацию записей по колонке {@code schema} (тип {@code jsonb}) с использованием JSONPath-оператора
     * PostgreSQL {@code @?}.
     * <p>
     * Условие:
     * <pre>
     * schema @? '$.properties[*] ? (@.valueType == "FILE")'
     * </pre>
     * Подробнее:
     * <ul>
     *   <li>{@code schema} – колонка типа {@code jsonb}, содержащая описание схемы слоя.</li>
     *   <li>{@code @?} – оператор «существует ли в JSON элемент, удовлетворяющий JSONPath-выражению».</li>
     *   <li>{@code '$.properties[*] ...'} – JSONPath-выражение:
     *     <ul>
     *       <li>{@code $} – корень JSON-документа (значение колонки {@code schema});</li>
     *       <li>{@code .properties} – переход к полю {@code "properties"} (ожидается массив объектов);</li>
     *       <li>{@code [*]} – перебор всех элементов массива {@code properties};</li>
     *       <li>{@code ? (@.valueType == "FILE")} – фильтр по элементам массива:
     *         берутся только те объекты, у которых поле {@code "valueType"} равно строке {@code "FILE"}.
     *       </li>
     *     </ul>
     *   </li>
     * </ul>
     * В результате условие возвращает {@code TRUE}, если в массиве {@code properties}
     * есть хотя бы один объект с {@code "valueType": "FILE"}.
     */

    public Optional<SchemasAndTables> findByIdentifierWithPropertyValueType(JdbcTemplate jdbcTemplate,
                                                                            String identifier,
                                                                            ValueType valueType) {
        String jsonPathExpression = String.format("exists($.properties[*] ? (@.valueType == \"%s\"))", valueType);

        String sql = "SELECT id, identifier, path, schema, title, crs " +
                "FROM schemas_and_tables " +
                "WHERE identifier = ? " +
                "  AND jsonb_path_match(schema, ?::jsonpath)";

        try {
            SchemasAndTables result = jdbcTemplate.queryForObject(sql,
                                                                  new SchemasAndTablesShortMapper(),
                                                                  identifier,
                                                                  jsonPathExpression);

            return Optional.ofNullable(result);
        } catch (Exception e) {
            log.warn("Ошибка получения таблицы с полем файл в схеме {}", e.getMessage());

            return Optional.empty();
        }
    }
}
