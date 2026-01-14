package ru.mycrg.data_service.service.gpkg.importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.sqlite.SQLiteException;
import ru.mycrg.data_service.service.gpkg.GpkgConnectionManager;
import ru.mycrg.data_service.service.gpkg.GpkgContentsDto;
import ru.mycrg.data_service.service.gpkg.GpkgException;
import ru.mycrg.data_service.service.gpkg.GpkgGeometryTypeMapper;
import ru.mycrg.data_service_contract.enums.GeometryType;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import static org.sqlite.SQLiteErrorCode.SQLITE_NOTADB;
import static ru.mycrg.data_service.service.gpkg.export.tables.LayerStyleWriter.GPKG_STYLE_LAYER_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.MediaFilesWriter.GPKG_MEDIA_FILES_TABLE;

@Repository
public class GpkgFileRepository {

    private final static Logger log = LoggerFactory.getLogger(GpkgFileRepository.class);

    private final GpkgGeometryTypeMapper geometryMapper;
    private final GpkgConnectionManager connectionManager;

    public GpkgFileRepository(GpkgGeometryTypeMapper geometryMapper,
                              GpkgConnectionManager connectionManager) {
        this.geometryMapper = geometryMapper;
        this.connectionManager = connectionManager;
    }

    public List<String> getVectorTableNames(String filePath) {
        String query = "SELECT table_name FROM gpkg_contents WHERE data_type LIKE 'features'";

        try (Connection connection = connectionManager.createConnection(filePath);
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {

            List<String> tableNames = new ArrayList<>();
            while (resultSet.next()) {
                tableNames.add(resultSet.getString("table_name"));
            }

            return tableNames;
        } catch (SQLiteException e) {
            String msg = String.format("Не удалось получить список векторных таблиц из GPKG файла: '%s'", filePath);
            if (SQLITE_NOTADB.equals(e.getResultCode())) {
                msg = String.format("Файл '%s' не является корректным GPKG файлом", filePath);
            }

            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        } catch (SQLException e) {
            String msg = "Ошибка получения списка векторных таблиц из GPKG файла: " + filePath;
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    public boolean isNotCorrectGpkg(String filePath) {
        try {
            getVectorTableNames(filePath);

            return false;
        } catch (Exception e) {
            return true;
        }
    }

    public List<String> getCrgCustomTableNames(String filePath) {
        String query = "SELECT table_name FROM gpkg_contents" +
                " WHERE data_type LIKE 'attributes'" +
                " AND table_name like 'crg%' OR table_name like '" + GPKG_STYLE_LAYER_TABLE + "'";

        try (Connection connection = connectionManager.createConnection(filePath);
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {

            List<String> tableNames = new ArrayList<>();
            while (resultSet.next()) {
                tableNames.add(resultSet.getString("table_name"));
            }

            return tableNames;
        } catch (SQLException e) {
            String msg = "Ошибка получения списка CRG таблиц из GPKG файла: " + filePath;
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    public Long getTableRowsCount(String filePath, String tableName) {
        String countQuery = "SELECT COUNT(*) FROM " + tableName;

        try (Connection connection = connectionManager.createConnection(filePath);
             PreparedStatement statement = connection.prepareStatement(countQuery);
             ResultSet resultSet = statement.executeQuery()) {

            return resultSet.next() ? resultSet.getLong(1) : 0L;
        } catch (SQLException e) {
            String msg = String.format("Ошибка получения количества строк таблицы %s из GPKG файла: %s",
                                       tableName, filePath);
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    public GeometryType getTableGeomType(String filePath, String tableName) {
        String countQuery = "SELECT geometry_type_name FROM gpkg_geometry_columns " +
                " WHERE table_name LIKE '" + tableName + "'";

        log.debug("Запрос получения типа геометрии из gpkg: {}", countQuery);

        try (Connection connection = connectionManager.createConnection(filePath);
             PreparedStatement statement = connection.prepareStatement(countQuery);
             ResultSet resultSet = statement.executeQuery()) {

            if (!resultSet.next()) {
                throw new GpkgException("Таблица не найдена в gpkg_geometry_columns: " + tableName);
            }

            return geometryMapper.mapType(resultSet.getString("geometry_type_name"));
        } catch (SQLException e) {
            String msg = String.format("Ошибка получения типа геометрии таблицы %s из GPKG файла: %s",
                                       tableName, filePath);
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    public GpkgContentsDto getGpkgContents(String filePath, String tableName) {
        String countQuery = "SELECT identifier, description, srs_id FROM gpkg_contents" +
                " WHERE identifier LIKE '" + tableName + "'";

        try (Connection connection = connectionManager.createConnection(filePath);
             PreparedStatement statement = connection.prepareStatement(countQuery);
             ResultSet resultSet = statement.executeQuery()) {

            if (!resultSet.next()) {
                throw new GpkgException("Таблица не найдена в gpkg_contents: " + tableName);
            }

            return new GpkgContentsDto(resultSet.getString("identifier"),
                                       resultSet.getString("description"),
                                       resultSet.getInt("srs_id"));
        } catch (SQLException e) {
            String msg = String.format("Ошибка получения содержимого таблицы %s из GPKG файла: %s",
                                       tableName, filePath);
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    public Map<String, byte[]> findFileById(String path, UUID filesId) {
        String sql = String.format("SELECT title, data FROM %s WHERE crg_id = '%s'", GPKG_MEDIA_FILES_TABLE, filesId);

        try (Connection connection = connectionManager.createConnection(path);
             PreparedStatement statement = connection.prepareStatement(sql)) {

            try (ResultSet resultSet = statement.executeQuery()) {
                Map<String, byte[]> filesMap = new HashMap<>();

                while (resultSet.next()) {
                    String title = resultSet.getString("title");
                    byte[] data = resultSet.getBytes("data");
                    filesMap.put(title, data);
                }

                return filesMap;
            }
        } catch (SQLException e) {
            String msg = String.format("Ошибка получения файла %s из GPKG!!!", filesId);
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }
}
