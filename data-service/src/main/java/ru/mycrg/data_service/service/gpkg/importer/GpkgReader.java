package ru.mycrg.data_service.service.gpkg.importer;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.gpkg.GpkgException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.http_client.JsonConverter;

import java.sql.*;

import static ru.mycrg.data_service.service.gpkg.export.GpkgWriter.*;

@Repository
public class GpkgReader {

    private final Logger log = LoggerFactory.getLogger(GpkgReader.class);

    public SchemaDto readSchemaFromGpkgFile(String gpkgFilePath, ResourceQualifier currentSourceAfterImportTable) {
        log.debug("Читаем схему из файла GPKG по пути: {} для таблицы: {}", gpkgFilePath,
                  currentSourceAfterImportTable.toString());

        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + gpkgFilePath)) {
            // Проверяем существование таблицы схем
            if (!schemaTableExists(connection)) {
                log.warn("Системная таблицы '" + GPKG_VECTOR_TABLE_SCHEMAS_TABLE + "' отсутствует в GPKG!!!");

                throw new GpkgException("Схемы для таблицы " + currentSourceAfterImportTable + " нет внутри GPKG");
            }

            // Читаем схему из таблицы
            String schemaJson = readSchemaJson(connection, currentSourceAfterImportTable);
            if (schemaJson == null || schemaJson.trim().isEmpty()) {
                log.warn("Схема таблицы не найдена в файле GPKG");

                throw new GpkgException("Для таблицы " + currentSourceAfterImportTable + " нет схемы.");
            }

            // Десериализуем JSON в SchemaDto
            return JsonConverter.fromJson(schemaJson, new TypeReference<SchemaDto>() {
                                })
                                .orElseGet(() -> {
                                    log.warn("Ошибка десериализации schema JSON, возвращаем пустую schema");

                                    throw new GpkgException("Нельзя десериализовать JSON схемы в GPKG.");
                                });
        } catch (SQLException e) {
            log.error("Ошибка чтение схемы из GPKG: {}", e.getMessage(), e);

            throw new GpkgException("Ошибка чтение схемы из GPKG", e);
        }
    }

    private boolean schemaTableExists(Connection connection) throws SQLException {
        String checkTableSql = "SELECT name FROM sqlite_master WHERE type='table' AND name='" + GPKG_VECTOR_TABLE_SCHEMAS_TABLE + "'";

        try (PreparedStatement stmt = connection.prepareStatement(checkTableSql);
             ResultSet rs = stmt.executeQuery()) {

            return rs.next();
        }
    }

    private String readSchemaJson(Connection connection, ResourceQualifier currentSourceAfterImportTable)
            throws SQLException {
        String selectSql =
                "SELECT " + GPKG_SCHEMA_JSON_COLUMN +
                        " FROM " + GPKG_VECTOR_TABLE_SCHEMAS_TABLE +
                        " WHERE " + GPKG_RESOURCE_NAME_COLUMN + " LIKE '%.' || ?" +
                        " ORDER BY id DESC LIMIT 1";

        try (PreparedStatement stmt = connection.prepareStatement(selectSql)) {
            stmt.setString(1, currentSourceAfterImportTable.toString());

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString(GPKG_SCHEMA_JSON_COLUMN);
                }

                return null;
            }
        }
    }

    public TableCreateDto readTableInfoFromGpkgFile(String gpkgFilePath,
                                                    ResourceQualifier currentSourceAfterImportTable) {
        log.debug("Читаем информацию о таблицы из файла GPKG по пути: {} для таблицы: {}", gpkgFilePath,
                  currentSourceAfterImportTable.toString());

        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + gpkgFilePath)) {
            // Проверяем существование таблицы с информацией о слоях
            if (!layerInfoTableExists(connection)) {
                log.error("Таблицы информации о векторной таблицы '" + GPKG_VECTOR_TABLE_INFO_TABLE + "' нет в GPKG!!!");

                throw new GpkgException("GPKG file does not contain layer information");
            }

            // Читаем информацию о слое из таблицы
            LayerInfo layerInfo = readLayerInfo(connection, currentSourceAfterImportTable);
            if (layerInfo == null) {
                log.error("Не найдено векторных таблицы в GPKG");

                throw new GpkgException("В GPKG не найдена информация о векторной таблице.");
            }

            // Создаем и заполняем TableCreateDto
            TableCreateDto table = new TableCreateDto();
            table.setTitle(removeQuotes(layerInfo.layerName));
            table.setCrs(removeQuotes(layerInfo.epsgCode));

            log.debug("Успешно прочитана информация о таблице: name={}, crs={}", layerInfo.layerName,
                      layerInfo.epsgCode);

            return table;
        } catch (SQLException e) {
            log.error("Ошибка чтения информации о векторной таблицы из GPKG: {}", e.getMessage(), e);

            throw new GpkgException("Ошибка чтения информации о векторной таблицы из GPKG", e);
        }
    }

    private boolean layerInfoTableExists(Connection connection) throws SQLException {
        String checkTableSql = "SELECT name FROM sqlite_master WHERE type='table' AND name='" + GPKG_VECTOR_TABLE_INFO_TABLE + "'";

        try (PreparedStatement stmt = connection.prepareStatement(checkTableSql);
             ResultSet rs = stmt.executeQuery()) {

            return rs.next();
        }
    }

    private LayerInfo readLayerInfo(Connection connection,
                                    ResourceQualifier currentSourceAfterImportTable) throws SQLException {
        String selectSql =
                "SELECT " + GPKG_VECTOR_TABLE_NAME_COLUMN + ", " + GPKG_VECTOR_TABLE_EPSG_CODE_COLUMN +
                        " FROM " + GPKG_VECTOR_TABLE_INFO_TABLE +
                        " WHERE " + GPKG_RESOURCE_NAME_COLUMN + " LIKE '%.' || ?" +
                        " ORDER BY id LIMIT 1";

        try (PreparedStatement stmt = connection.prepareStatement(selectSql)) {
            stmt.setString(1, currentSourceAfterImportTable.getTable());

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new LayerInfo(rs.getString(GPKG_VECTOR_TABLE_NAME_COLUMN),
                                         rs.getString(GPKG_VECTOR_TABLE_EPSG_CODE_COLUMN));
                }

                return null;
            }
        }
    }

    /**
     * Удаляет кавычки из начала и конца строки, если они есть
     *
     * @param value строка для обработки
     *
     * @return строка без кавычек
     */
    private String removeQuotes(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        if (trimmed.length() >= 2 &&
                trimmed.startsWith("\"") && trimmed.endsWith("\"")) {

            return trimmed.substring(1, trimmed.length() - 1);
        }

        return value;
    }

    private static class LayerInfo {

        final String layerName;
        final String epsgCode;

        LayerInfo(String layerName, String epsgCode) {
            this.layerName = layerName;
            this.epsgCode = epsgCode;
        }
    }
}
