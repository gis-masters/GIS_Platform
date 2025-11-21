package ru.mycrg.data_service.service.gpkg.importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTableType;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTablesData;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepositoryDetached;
import ru.mycrg.data_service.service.gpkg.GpkgContentsDto;
import ru.mycrg.data_service.service.gpkg.GpkgException;
import ru.mycrg.data_service_contract.enums.GeometryType;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTableType.CRG_DATA_TABLE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTableType.VECTOR_DATA_TABLE;

@Service
public class GpkgReaderService {

    private final static Logger log = LoggerFactory.getLogger(GpkgReaderService.class);
    private final GpkgFileRepository gpkgFileRepository;
    private final FileRepositoryDetached fileRepository;

    public GpkgReaderService(GpkgFileRepository gpkgFileRepository,
                             FileRepositoryDetached fileRepository) {
        this.gpkgFileRepository = gpkgFileRepository;
        this.fileRepository = fileRepository;
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
        List<GpkgTablesData> allTables;
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

    public GeometryType getLayerGeometryType(JdbcTemplate jdbcTemplate, UUID fileId, String sourceTableName) {
        Optional<File> oFile = fileRepository.findByIdentifier(jdbcTemplate, fileId);
        if (oFile.isEmpty()) {
            throw new NotFoundException("Не найден файл с ID: " + fileId);
        }

        try (Connection connection = createConnection(oFile.get().getPath())) {
            return gpkgFileRepository.getTableGeomType(connection, sourceTableName);
        } catch (Exception e) {
            throw new GpkgException("Проблема чтения из gpkg: " + e.getMessage());
        }
    }

    public GpkgContentsDto getVectorTableContent(JdbcTemplate jdbcTemplate, UUID fileId, String sourceTableName) {
        Optional<File> oFile = fileRepository.findByIdentifier(jdbcTemplate, fileId);
        if (oFile.isEmpty()) {
            throw new NotFoundException("Не найден файл с ID: " + fileId);
        }

        try (Connection connection = createConnection(oFile.get().getPath())) {
            return gpkgFileRepository.getGpkgContents(connection, sourceTableName);
        } catch (Exception e) {
            throw new GpkgException(e.getMessage());
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
