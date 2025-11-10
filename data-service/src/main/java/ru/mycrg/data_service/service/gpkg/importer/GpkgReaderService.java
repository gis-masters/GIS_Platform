package ru.mycrg.data_service.service.gpkg.importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTablesData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTableType;
import ru.mycrg.data_service.service.gpkg.GpkgException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTableType.CRG_DATA_TABLE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTableType.VECTOR_DATA_TABLE;

@Service
public class GpkgReaderService {

    private final Logger log = LoggerFactory.getLogger(GpkgReaderService.class);
    private final GpkgFileRepository gpkgFileRepository;

    public GpkgReaderService(GpkgFileRepository gpkgFileRepository) {
        this.gpkgFileRepository = gpkgFileRepository;
    }

    /**
     * Получает информацию о всех таблицах из GPKG файла (векторные + CRG кастомные)
     *
     * @param filePath путь к GPKG файлу
     *
     * @return список данных о таблицах
     *
     * @throws GpkgException если не удалось прочитать файл
     */
    public List<GpkgTablesData> getTablesSmallInfoFromGpkg(String filePath) {
        List<GpkgTablesData> allTables = new ArrayList<>();
        try (Connection connection = createConnection(filePath)) {
            List<GpkgTablesData> vectorTables = getVectorTablesData(connection);
            allTables = new ArrayList<>(vectorTables);

            List<GpkgTablesData> crgTables = getCrgCustomTablesData(connection);
            allTables.addAll(crgTables);

            log.debug("Найдено {} таблиц в GPKG файле: {}", allTables.size(), filePath);

            return allTables;
        } catch (SQLException e) {
            log.error("Ошибка чтения из GPKG файла: {}", filePath, e);

            throw new GpkgException("Невозможно прочитать gpkg. Причина: " + e.getMessage());
        }
    }

    private List<GpkgTablesData> getVectorTablesData(Connection connection) throws SQLException {
        List<String> tableNames = gpkgFileRepository.getVectorTableNames(connection);

        return createTablesData(connection, tableNames, VECTOR_DATA_TABLE);
    }

    private List<GpkgTablesData> getCrgCustomTablesData(Connection connection) throws SQLException {
        List<String> tableNames = gpkgFileRepository.getCrgCustomTableNames(connection);

        return createTablesData(connection, tableNames, CRG_DATA_TABLE);
    }

    private List<GpkgTablesData> createTablesData(Connection connection,
                                                  List<String> tableNames,
                                                  GpkgTableType tableType) {
        List<GpkgTablesData> result = new ArrayList<>();

        for (String tableName: tableNames) {
            try {
                GpkgTablesData tableData = new GpkgTablesData(tableType, tableName);
                Long rowsCount = gpkgFileRepository.getTableRowsCount(connection, tableName);
                tableData.setRowsCount(rowsCount);
                result.add(tableData);

                log.debug("Обработана таблица: {} (тип: {}, строк: {})", tableName, tableType, rowsCount);
            } catch (SQLException e) {
                log.warn("Не удалось получить информацию о таблице: {}. Пропускаем. Ошибка: {}",
                         tableName, e.getMessage());
            }
        }

        return result;
    }

    private Connection createConnection(String filePath) throws SQLException {
        log.debug("Создание соединения с GPKG файлом: {}", filePath);

        return DriverManager.getConnection("jdbc:sqlite:" + filePath);
    }
}
