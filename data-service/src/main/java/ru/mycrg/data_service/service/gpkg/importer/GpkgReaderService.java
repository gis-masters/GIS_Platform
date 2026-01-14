package ru.mycrg.data_service.service.gpkg.importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTableType;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepositoryDetached;
import ru.mycrg.data_service.service.gpkg.GpkgContentsDto;
import ru.mycrg.data_service.service.gpkg.GpkgException;
import ru.mycrg.data_service_contract.enums.GeometryType;

import java.util.*;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTableType.CRG_DATA_TABLE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTableType.VECTOR_DATA_TABLE;

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
    public List<GpkgTablesData> getTablesInfo(String filePath) {
        List<GpkgTablesData> vectorTables = getVectorTablesData(filePath);
        List<GpkgTablesData> allTables = new ArrayList<>(vectorTables);

        List<GpkgTablesData> crgTables = getCrgCustomTablesData(filePath);
        allTables.addAll(crgTables);

        log.debug("Найдено {} таблиц в GPKG файле: {}", allTables.size(), filePath);

        return allTables;
    }

    public List<GpkgTablesData> getOnlyVectorTablesInfo(String filePath) {
        return getVectorTablesData(filePath);
    }

    public void throwIfNotGpkg(File file) {
        if (gpkgFileRepository.isNotCorrectGpkg(file.getPath())) {
            throw new BadRequestException("Файл " + file.getId() + " не является корректным GPKG файлом");
        }
    }

    public GeometryType getLayerGeometryType(JdbcTemplate jdbcTemplate, UUID fileId, String sourceTableName) {
        Optional<File> oFile = fileRepository.findByIdentifier(jdbcTemplate, fileId);
        if (oFile.isEmpty()) {
            throw new NotFoundException("Не найден файл с ID: " + fileId);
        }

        return gpkgFileRepository.getTableGeomType(oFile.get().getPath(), sourceTableName);
    }

    public GpkgContentsDto getVectorTableContent(JdbcTemplate jdbcTemplate, UUID fileId, String sourceTableName) {
        Optional<File> oFile = fileRepository.findByIdentifier(jdbcTemplate, fileId);
        if (oFile.isEmpty()) {
            throw new NotFoundException("Не найден файл с ID: " + fileId);
        }

        return gpkgFileRepository.getGpkgContents(oFile.get().getPath(), sourceTableName);
    }

    private List<GpkgTablesData> getVectorTablesData(String filePath) {
        List<String> tableNames = gpkgFileRepository.getVectorTableNames(filePath);

        return createTablesData(filePath, tableNames, VECTOR_DATA_TABLE);
    }

    private List<GpkgTablesData> getCrgCustomTablesData(String filePath) {
        List<String> tableNames = gpkgFileRepository.getCrgCustomTableNames(filePath);

        return createTablesData(filePath, tableNames, CRG_DATA_TABLE);
    }

    private List<GpkgTablesData> createTablesData(String filePath,
                                                  List<String> tableNames,
                                                  GpkgTableType tableType) {
        List<GpkgTablesData> result = new ArrayList<>();

        for (String tableName: tableNames) {
            try {
                GpkgTablesData tableData = new GpkgTablesData(tableType, tableName);
                Long rowsCount = gpkgFileRepository.getTableRowsCount(filePath, tableName);
                tableData.setRowsCount(rowsCount);
                result.add(tableData);

                log.debug("Обработана таблица: {} (тип: {}, строк: {})", tableName, tableType, rowsCount);
            } catch (GpkgException e) {
                log.warn("Не удалось получить информацию о таблице: {}. Пропускаем. Ошибка: {}",
                         tableName, e.getMessage());
            }
        }

        return result;
    }

    public Map<UUID, MultipartFile> getFilesFromGpkg(String path, List<UUID> fileIds) {
        if (fileIds == null || fileIds.isEmpty()) {
            throw new GpkgException("Список идентификаторов файлов пуст или не передан!");
        }

        Map<UUID, MultipartFile> allFoundFiles = new HashMap<>();

        for (UUID id: fileIds) {
            Map<String, byte[]> fileFromGpkg = gpkgFileRepository.findFileById(path, id);

            for (Map.Entry<String, byte[]> entry: fileFromGpkg.entrySet()) {
                MultipartFile multipartFile = new MockMultipartFile(
                        "file",
                        entry.getKey(),
                        "application/octet-stream",
                        entry.getValue()
                );
                allFoundFiles.put(id, multipartFile);
            }
        }

        log.info("Получено {} файлов из GPKG", allFoundFiles.size());

        return allFoundFiles;
    }
}
