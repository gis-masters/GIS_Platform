package ru.mycrg.gis.service;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.config.GisStorageProperties;
import ru.mycrg.gis.dto.ColumnProjection;
import ru.mycrg.gis.dto.TableProjection;
import ru.mycrg.gis.exceptions.GisException;
import ru.mycrg.gis.exceptions.GisSqlException;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class GisStorageDaoService {

    private static final Logger log = LoggerFactory.getLogger(GisStorageDaoService.class);

    private static final String AS_IS = "AsIs";
    private static final String NOT_IMPORT = "NotImport";
    private final String TARGET_COLUMN = "shape";
    private HikariDataSource dataSource;

    private final GisStorageProperties storageProperties;

    @Autowired
    public GisStorageDaoService(GisStorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    /**
     * При импорте выполняется:
     *  - Очистка целевой таблицы и таблицы с данными валидации (*_extension)
     *  - Добавление в рабочую таблицу колонок которые имеют тип импорта "AsIs"
     *  - Перенос из исходной таблицы в рабочую
     *  - Проверка и при необходимости генерация GLOBALID
     *
     * @param workImport Данные импорта
     */
    public void doImport(WorkImport workImport) {
        log.info("Try import {} tasks", workImport.getImportTasks().size());

        Statement statement = null;
        try {
            statement = getConnection(workImport.getDbName()).createStatement();

            List<ImportTask> importTasks = workImport.getImportTasks();
            for (ImportTask importTask : importTasks) {
                importTable(workImport, statement, importTask);
            }
        } catch (SQLException e) {
            log.error("Failed get statement: {}", e.getLocalizedMessage());

            throw new GisSqlException("Failed get statement: " + e.getLocalizedMessage());
        } finally {
            try {
                assert statement != null;
                statement.close();
                dataSource.close();
            } catch (SQLException e) {
                log.error("Failed free resources: {}", e.getLocalizedMessage());
            }
        }
    }

    /**
     * Получить все таблицы по указанным параметрам.
     * @param dbName Название БД
     * @param schemaPattern Название схемы.
     * @return
     */
    public List<TableProjection> getAllTables(final String dbName, final String schemaPattern) {
        List<TableProjection> tablesProjection = new ArrayList<>();
        try {
            DatabaseMetaData metaData = getConnection(dbName).getMetaData();
            String[] types = {"TABLE"};

            ResultSet tableSelector = metaData.getTables(null, schemaPattern, "%", types);
            while (tableSelector.next()) {
                String tableCatalog = tableSelector.getString(1);
                String tableSchema = tableSelector.getString(2);
                String tableName = tableSelector.getString(3);

                ResultSet targetColumnsSelector = metaData.getColumns(null, schemaPattern, tableName, TARGET_COLUMN);
                if (targetColumnsSelector.next()) {
                    List<ColumnProjection> columns = new ArrayList<>();

                    ResultSet allColumnsSelector = metaData.getColumns(null, schemaPattern, tableName, null);
                    while (allColumnsSelector.next()) {
                        columns.add(new ColumnProjection(allColumnsSelector.getString(4), allColumnsSelector.getString("TYPE_NAME")));
                    }
                    allColumnsSelector.close();

                    tablesProjection.add(new TableProjection(tableName, columns));
                }
                targetColumnsSelector.close();
            }
            tableSelector.close();
        } catch (RuntimeException e) {
            log.error("Failed get tables: {}", e.getLocalizedMessage());

            throw new GisException("Failed get tables: " + e.getLocalizedMessage());
        } catch (SQLException e) {
            log.error("Failed get tables: {}", e.getLocalizedMessage());

            throw new GisSqlException("Failed get tables: " + e.getLocalizedMessage());
        } finally {
            dataSource.close();
        }

        log.info("Successfully {}", tablesProjection.size());
        return tablesProjection;
    }

    private void importTable(WorkImport workImport, Statement statement, ImportTask importTask) {
        log.info("Import to: {}", importTask.getWorkTableName());

        try {
            truncate(statement, workImport.getTargetSchema(), importTask.getWorkTableName());
            truncate(statement, workImport.getTargetSchema(), importTask.getWorkTableName() + "_extension");

            if (isNeedPrepareTable(importTask)) {
                prepareTable(statement, workImport, importTask);
            }

            importData(statement, workImport, importTask);
        } catch (SQLException e) {
            log.error("Failed execute import: {}", e.getLocalizedMessage());

            throw new GisSqlException("Failed execute import for table: " + importTask.getWorkTableName() +
                    " / " + e.getLocalizedMessage());
        }
    }

    private boolean isNeedPrepareTable(ImportTask importTask) {
        return importTask
                .getMapping().stream()
                .anyMatch(geoMapping -> AS_IS.equals(geoMapping.getTarget().getType()));
    }

    private void prepareTable(Statement statement, WorkImport workImport, ImportTask importTask) throws SQLException {
        String sqlRequest = prepareAlterRequest(importTask, workImport.getTargetSchema());

        log.info("SQL alter request: {}", sqlRequest);

        statement.execute(sqlRequest);
    }

    private void importData(Statement statement, WorkImport workImport, ImportTask importTask) throws SQLException {
        String sqlRequest = prepareInsertRequest(importTask, workImport.getTargetSchema(), workImport.getSourceSchema());

        log.info("SQL import request: {}", sqlRequest);

        statement.execute(sqlRequest);
    }

    private void truncate(Statement statement, String schema, String table) throws SQLException {
        log.debug("Truncate: {}.{}", schema, table);

        statement.execute(String.format("TRUNCATE %s.%s", schema, table));
    }

    private String prepareInsertRequest(ImportTask importTask, String targetSchema, String sourceSchema) {
        String insertTo = "INSERT INTO " + targetSchema + "." + importTask.getWorkTableName();
        String data = handleInsertMappingColumns(importTask);
        String from = " FROM " + sourceSchema + "." + '\"' + importTask.getLayerName() + '\"';

        return insertTo + data + from;
    }

    private String prepareAlterRequest(ImportTask importTask, String targetSchema) {
//        ALTER TABLE fiz.functionalzone ADD COLUMN IF NOT EXISTS fiz6 INTEGER,
//                                       ADD COLUMN IF NOT EXISTS fiz5 INTEGER,
//                                       ADD COLUMN IF NOT EXISTS fiz4 INTEGER;
        String alter = "ALTER TABLE " + targetSchema + "." + importTask.getWorkTableName() + " ";
        StringBuilder columns = new StringBuilder();

        List<GeoMapping> mapping = importTask.getMapping();
        for (GeoMapping geoMapping : mapping) {
            ColumnProjection target = geoMapping.getTarget();
            if (target.getType().equals(AS_IS)) {
                columns
                        .append("ADD COLUMN IF NOT EXISTS ")
                        .append(geoMapping.getSource().getName())
                        .append(" ")
                        .append(defineColumnType(geoMapping.getSource().getBinding()))
                        .append(", ");
            }
        }

        columns = new StringBuilder(columns.substring(0, columns.length() - 2));

        return alter + columns;
    }

    private String defineColumnType(String binding) {
        // TODO

        if (binding.contains("Double")) {
            return "numeric";
        }

        if (binding.contains("Integer")) {
            return "integer";
        }

        return "varchar";
    }

    private String handleInsertMappingColumns(ImportTask importTask) {
        List<GeoMapping> mapping = importTask.getMapping();
        String pre = " (";
        String post = ") ";

        StringBuilder targetColumns = new StringBuilder();
        StringBuilder sourceColumns = new StringBuilder("SELECT ");
        for (GeoMapping geoMapping : mapping) {
            ColumnProjection target = geoMapping.getTarget();
            if (target.getType().equals("serial") || target.getType().equals(NOT_IMPORT)) {
                continue;
            }

            String tName;
            String sName;
            if (target.getType().equals(AS_IS)) {
                tName = sName = geoMapping.getSource().getName();
            } else {
                tName = target.getName();
                sName = geoMapping.getSource().getName();
            }

            targetColumns.append(tName).append(", ");
            sourceColumns.append("\"").append(sName).append("\", ");
        }

        targetColumns = new StringBuilder(pre + targetColumns.substring(0, targetColumns.length() - 2) + post);
        sourceColumns = new StringBuilder(sourceColumns.substring(0, sourceColumns.length() - 2));

        return targetColumns + sourceColumns.toString();
    }

    private Connection getConnection(String dbName) {
        dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(getConnectionUrl(dbName));
        dataSource.setUsername(storageProperties.getUser());
        dataSource.setPassword(storageProperties.getPassword());
        dataSource.setMaximumPoolSize(1);

        Connection connection;
        try {
            connection = dataSource.getConnection();
        } catch (SQLException e) {
            log.error("Failed get connection: {}", e.getLocalizedMessage());

            throw new GisSqlException("Failed get connection: " + e.getLocalizedMessage());
        }

        return connection;
    }

    private String getConnectionUrl(String dbName) {
        String result;

        result = "jdbc:postgresql://" + storageProperties.getHost() + "/" + dbName;
        log.info("Url to new Db: {}", result);

        return result;
    }

}
