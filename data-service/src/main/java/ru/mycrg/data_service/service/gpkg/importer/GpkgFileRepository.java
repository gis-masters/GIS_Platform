package ru.mycrg.data_service.service.gpkg.importer;

import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.data_service.service.gpkg.export.GpkgWriter.GPKG_STYLE_LAYER_TABLE;

@Repository
public class GpkgFileRepository {

    public List<String> getVectorTableNames(Connection connection) throws SQLException {
        String query = "SELECT table_name FROM gpkg_contents WHERE data_type LIKE 'features'";

        return getTableNames(connection, query);
    }

    public List<String> getCrgCustomTableNames(Connection connection) throws SQLException {
        String query = "SELECT table_name FROM gpkg_contents" +
                " WHERE data_type LIKE 'attributes'" +
                " AND table_name like 'crg%' OR table_name like '" + GPKG_STYLE_LAYER_TABLE + "'";

        return getTableNames(connection, query);
    }

    public Long getTableRowsCount(Connection connection, String tableName) throws SQLException {
        String countQuery = "SELECT COUNT(*) FROM " + tableName;
        try (PreparedStatement statement = connection.prepareStatement(countQuery);
             ResultSet resultSet = statement.executeQuery()) {

            return resultSet.next() ? resultSet.getLong(1) : 0L;
        }
    }

    private List<String> getTableNames(Connection connection, String query) throws SQLException {
        List<String> tableNames = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                tableNames.add(resultSet.getString("table_name"));
            }
        }

        return tableNames;
    }
}

