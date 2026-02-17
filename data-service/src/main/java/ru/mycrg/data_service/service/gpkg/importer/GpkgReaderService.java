package ru.mycrg.data_service.service.gpkg.importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsAttributes;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsBaseDto;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsFeatures;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsTiles;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepositoryDetached;
import ru.mycrg.data_service.service.gpkg.GpkgException;
import ru.mycrg.data_service_contract.enums.GeometryType;

import java.sql.Connection;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.enums.GpkgContentsDataType.*;

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

    public Connection getConnectionToGpkg(String filePath) {
        return gpkgFileRepository.getConnectionToGpkg(filePath);
    }

    public List<GpkgContentsFeatures> getAllVectorLayersFromGpkgContents(Connection connection) {
        return gpkgFileRepository
                .getPartOfGpkgContents(connection, FEATURES)
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(GpkgContentsBaseDto::getTableName,
                                         baseDto -> baseDto
                        ),
                        baseContentsMap -> {
                            Map<String, Long> featuresCount =
                                    gpkgFileRepository.getGpkgOgrContentsByTableNames(connection,
                                                                                      baseContentsMap.keySet());

                            return baseContentsMap.values().stream()
                                                  .map(baseDto -> new GpkgContentsFeatures(
                                                          baseDto.getTableName(),
                                                          baseDto.getDataType(),
                                                          baseDto.getDescription(),
                                                          featuresCount.getOrDefault(
                                                                  baseDto.getTableName(), 0L),
                                                          baseDto.getSriId()
                                                  ))
                                                  .collect(Collectors.toList());
                        }
                ));
    }

    public List<GpkgContentsTiles> getAllTilesFromGpkgContents(Connection connection) {
        return gpkgFileRepository.getPartOfGpkgContents(connection, TILES)
                                 .collect(Collectors.toList());
    }

    public List<GpkgContentsAttributes> getAllSystemTablesFromGpkgContents(Connection connection) {
        return gpkgFileRepository.getPartOfGpkgContents(connection, ATTRIBUTES)
                                 .map(content -> new GpkgContentsAttributes(content.getTableName(),
                                                                            content.getDataType(),
                                                                            content.getDescription(),
                                                                            content.getTableName().contains("crg")))
                                 .collect(Collectors.toList());
    }

    public GeometryType getLayerGeometryType(JdbcTemplate jdbcTemplate, UUID fileId, String sourceTableName) {
        Optional<File> oFile = fileRepository.findByIdentifier(jdbcTemplate, fileId);
        if (oFile.isEmpty()) {
            throw new NotFoundException("Не найден файл с ID: " + fileId);
        }

        return gpkgFileRepository.getTableGeomType(oFile.get().getPath(), sourceTableName);
    }

    public GpkgContentsTiles getVectorTableContent(JdbcTemplate jdbcTemplate, UUID fileId, String sourceTableName) {
        Optional<File> oFile = fileRepository.findByIdentifier(jdbcTemplate, fileId);
        if (oFile.isEmpty()) {
            throw new NotFoundException("Не найден файл с ID: " + fileId);
        }

        return gpkgFileRepository.getGpkgContents(oFile.get().getPath(), sourceTableName);
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

    public boolean isAllLayersExistInGpkgContents(Connection connection, Set<String> tableNames) {
        return gpkgFileRepository.isAllLayersExistInGpkgContents(connection, tableNames);
    }

    public boolean isGpkgValidDataBaseFile(Connection connection) {
        String failFastSql = "SELECT 1 FROM gpkg_contents LIMIT 1";
        try {
            gpkgFileRepository.executeSql(connection, failFastSql);

            return true;
        } catch (Exception e) {
            log.debug("Ошибка при проверки валидности gpkg файла: {}", e.getMessage());

            return false;
        }
    }

    public Map<String, Long> findTilesReferenceByNames(Connection connection, Set<String> names) {
        return gpkgFileRepository.findTilesReferenceByNames(connection, names);
    }

    public String getSrcByIdentifier(Connection connection, String name) {
        return gpkgFileRepository.getSrcByIdentifier(connection, name);
    }
}
