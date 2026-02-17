package ru.mycrg.data_service.service.gpkg.importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.common_contracts.enums.GpkgContentsDataType;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsTiles;
import ru.mycrg.data_service.service.gpkg.GpkgConnectionManager;
import ru.mycrg.data_service.service.gpkg.GpkgException;
import ru.mycrg.data_service.service.gpkg.GpkgGeometryTypeMapper;
import ru.mycrg.data_service_contract.enums.GeometryType;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Stream;

import static ru.mycrg.data_service.service.gpkg.export.tables.MediaFilesWriter.GPKG_MEDIA_FILES_TABLE;

@Repository
//TODO - все методы должны начать принимать Connection а не file path
public class GpkgFileRepository {

    private final static Logger log = LoggerFactory.getLogger(GpkgFileRepository.class);

    private final GpkgGeometryTypeMapper geometryMapper;
    private final GpkgConnectionManager connectionManager;

    public GpkgFileRepository(GpkgGeometryTypeMapper geometryMapper,
                              GpkgConnectionManager connectionManager) {
        this.geometryMapper = geometryMapper;
        this.connectionManager = connectionManager;
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

    public GpkgContentsTiles getGpkgContents(String filePath, String tableName) {
        String countQuery = "SELECT identifier, data_type, description, srs_id FROM gpkg_contents" +
                " WHERE identifier LIKE '" + tableName + "'";

        try (Connection connection = connectionManager.createConnection(filePath);
             PreparedStatement statement = connection.prepareStatement(countQuery);
             ResultSet resultSet = statement.executeQuery()) {

            if (!resultSet.next()) {
                throw new GpkgException("Таблица не найдена в gpkg_contents: " + tableName);
            }

            return new GpkgContentsTiles(resultSet.getString("identifier"),
                                         GpkgContentsDataType
                                                 .stringToGpkgContentsDataType(resultSet.getString("data_type")),
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

    public Stream<GpkgContentsTiles> getPartOfGpkgContents(Connection connection, GpkgContentsDataType dataType) {
        String sql = "SELECT identifier, data_type, description, srs_id FROM gpkg_contents" +
                " WHERE data_type LIKE '" + dataType.getDataTypeAsString() + "'";

        List<GpkgContentsTiles> allVectorTables = new ArrayList<>();

        try (PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                allVectorTables
                        .add(new GpkgContentsTiles(resultSet.getString("identifier"),
                                                   GpkgContentsDataType
                                                           .stringToGpkgContentsDataType(
                                                                   resultSet.getString("data_type")),
                                                   resultSet.getString("description"),
                                                   resultSet.getInt("srs_id")));
            }

            return allVectorTables.stream();
        } catch (SQLException e) {
            String msg = String.format("Ошибка выполнения запроса '%s' в GPKG файле: %s", sql, e.getMessage());
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    public Map<String, Long> getGpkgOgrContentsByTableNames(Connection connection, Set<String> nameSet) {
        if (nameSet == null || nameSet.isEmpty()) {
            return new HashMap<>();
        }

        String placeholders = String.join(",", Collections.nCopies(nameSet.size(), "?"));

        String query = "SELECT table_name, feature_count FROM gpkg_ogr_contents WHERE table_name IN (" + placeholders + ")";

        Map<String, Long> result = new HashMap<>();

        try (PreparedStatement statement = connection.prepareStatement(query)) {

            // Заполняем плейсхолдеры значениями из Set
            int index = 1;
            for (String tableName: nameSet) {
                statement.setString(index++, tableName);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    String tableName = resultSet.getString("table_name");
                    long featureCount = resultSet.getLong("feature_count");
                    result.put(tableName, featureCount);
                }
            }

            return result;
        } catch (SQLException e) {
            String msg = String.format("Ошибка получения feature_count из gpkg_ogr_contents для %s", nameSet);
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    public Map<String, Long> findTilesReferenceByNames(Connection connection, Set<String> names) {
        if (names == null || names.isEmpty()) {
            return new HashMap<>();
        }
        String values = String.join(",", Collections.nCopies(names.size(), "(?)"));

        String sql =
                "WITH input(name) AS (VALUES " + values + ") " +
                        "SELECT i.name AS name, MIN(m.id) AS id " +
                        "FROM input i " +
                        "LEFT JOIN " + GPKG_MEDIA_FILES_TABLE + " m ON m.name = i.name " +
                        "GROUP BY i.name";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            int idx = 1;
            for (String n: names) {
                ps.setString(idx++, n);
            }

            Map<String, Long> result = new HashMap<>();
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String name = rs.getString("name");

                    long idVal = rs.getLong("id");
                    Long id = rs.wasNull() ? null : idVal;

                    result.put(name, id);
                }
            }

            return result;
        } catch (SQLException e) {
            String msg = "Произошла ошибка при поиске файловых референсов к растровым слоям";
            log.error("{} => {}", msg, e.getMessage(), e);

            return new HashMap<>();
        }
    }

    public boolean isAllLayersExistInGpkgContents(Connection connection, Set<String> tableNames) {
        if (tableNames == null || tableNames.isEmpty()) {
            return false;
        }

        String placeholders = String.join(",", java.util.Collections.nCopies(tableNames.size(), "?"));

        String sql = "SELECT COUNT(DISTINCT table_name) " +
                "FROM gpkg_contents WHERE table_name IN (" + placeholders + ")";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {

            int idx = 1;
            for (String name: tableNames) {
                ps.setString(idx++, name);
            }

            try (ResultSet rs = ps.executeQuery()) {
                int found = rs.next() ? rs.getInt(1) : 0;

                return found == tableNames.size();
            }
        } catch (SQLException e) {
            String msg = String.format("Не удалось проверить наличие слоёв в gpkg_contents (table_names=%s)",
                                       tableNames);
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    public String getSrcByIdentifier(Connection connection, String gpkgLayerIdentifier) {
        String srsIdQuery = "SELECT srs_id FROM gpkg_contents WHERE identifier LIKE ?";
        String srsInfoQuery = "SELECT organization, organization_coordsys_id FROM gpkg_spatial_ref_sys WHERE srs_id = ?";

        log.debug("srsIdQuery  __ {}", srsIdQuery);
        log.debug("srsInfoQuery  __ {}", srsInfoQuery);

        try (PreparedStatement srsIdStatement = connection.prepareStatement(srsIdQuery)) {

            srsIdStatement.setString(1, gpkgLayerIdentifier);

            try (ResultSet srsIdResultSet = srsIdStatement.executeQuery()) {
                if (!srsIdResultSet.next()) {
                    throw new GpkgException("Слой не найден в gpkg_contents: " + gpkgLayerIdentifier);
                }

                int srsId = srsIdResultSet.getInt("srs_id");

                log.debug("srsId  __ {}", srsId);

                try (PreparedStatement srsInfoStatement = connection.prepareStatement(srsInfoQuery)) {
                    srsInfoStatement.setInt(1, srsId);

                    try (ResultSet srsInfoResultSet = srsInfoStatement.executeQuery()) {
                        if (!srsInfoResultSet.next()) {
                            throw new GpkgException("SRS не найден в gpkg_spatial_ref_sys для srs_id: " + srsId);
                        }

                        String organization = srsInfoResultSet.getString("organization");
                        int organizationCoordsysId = srsInfoResultSet.getInt("organization_coordsys_id");

                        log.debug("organization  __ {}", organization);
                        log.debug("organizationCoordsysId  __ {}", organizationCoordsysId);

                        return organization + ":" + organizationCoordsysId;
                    }
                }
            }
        } catch (SQLException e) {
            String msg = String.format("Ошибка получения SRS для слоя %s из gpkg", gpkgLayerIdentifier);
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }

    /**
     * Использовать осторожно. Просто выполняет любой sql.
     */
    public void executeSql(Connection connection, String sql) {
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.execute();
        } catch (SQLException e) {
            throw new GpkgException("Ошибка выполнения SQL: " + e.getMessage(), e);
        }
    }

    /**
     * Использовать только внутри try-with-resousrces
     * @param filePath путь к файлу на сервере
     * @return интерфейс подключения jdbc:sqlite
     */
    protected Connection getConnectionToGpkg(String filePath) {
        try {
            return connectionManager.createConnection(filePath);
        } catch (SQLException e) {
            String msg = "Ошибка подключения к файлу GPKG: " + filePath;
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GpkgException(msg);
        }
    }
}
