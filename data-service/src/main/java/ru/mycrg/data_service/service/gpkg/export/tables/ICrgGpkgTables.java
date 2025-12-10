package ru.mycrg.data_service.service.gpkg.export.tables;

import java.sql.Connection;
import java.sql.SQLException;

public interface ICrgGpkgTables {

    void createTableIfNotExist(Connection connection) throws SQLException;
}
