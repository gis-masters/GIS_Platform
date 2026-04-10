package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildFilesIdFindInRecordsQuery;

@Repository
public class RecordsDaoDetached {

    private final Logger log = LoggerFactory.getLogger(RecordsDaoDetached.class);

    /**
     * Извлекает все уникальные ID файлов из JSONB-полей векторной таблицы.
     *
     * @param jdbcTemplate JDBC-шаблон для выполнения запроса
     * @param schemaName   имя схемы базы данных
     * @param tableName    имя таблицы
     * @param fileProps    список имен полей типа JSONB, содержащих массивы файлов
     *
     * @return список уникальных UUID файлов из всех указанных полей
     */
    public List<UUID> getAllFilesIdInTable(JdbcTemplate jdbcTemplate,
                                           String schemaName,
                                           String tableName,
                                           List<String> fileProps) {

        String query = buildFilesIdFindInRecordsQuery(schemaName, tableName, fileProps);
        log.debug("Запрос поиска ID файлов в таблице: {}", query);
        try {
            return jdbcTemplate.queryForList(query, UUID.class);
        } catch (Exception e) {
            log.error("Не удалось найти информацию о файлах внутри векторной таблицы. Причина: {}", e.getMessage());

            return new ArrayList<>();
        }
    }
}
