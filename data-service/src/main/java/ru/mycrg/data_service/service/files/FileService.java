package ru.mycrg.data_service.service.files;

import org.apache.commons.compress.utils.FileNameUtils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.FileGroupModel;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.FileType;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultOrganizationName;
import static ru.mycrg.data_service.service.files.FileUtil.*;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.StringUtil.hashCodeAsString;
import static ru.mycrg.data_service_contract.enums.FileType.*;

@Service
@Transactional
public class FileService {

    public static Map<FileType, FileGroupModel> fileGroups = Map.of(
            SHP, new FileGroupModel(Set.of("shp", "dbf", "shx", "prj"),
                                    Set.of("shp", "dbf", "shx", "prj", "cpg", "sbn", "sbx")),
            TAB, new FileGroupModel(Set.of("dat", "id", "map", "tab")),
            MID, new FileGroupModel(Set.of("mid", "mif")),
            DXF, new FileGroupModel(Set.of("dxf")),
            TIF, new FileGroupModel(Set.of("tif")),
            GML, new FileGroupModel(Set.of("gml"))
    );

    private final Logger log = LoggerFactory.getLogger(FileService.class);

    private final RecordsDao recordsDao;
    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;

    public FileService(RecordsDao recordsDao,
                       FileRepository fileRepository,
                       FileStorageService fileStorageService,
                       IAuthenticationFacade authenticationFacade) {
        this.recordsDao = recordsDao;
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;
    }

    public void relateFiles(SchemaDto schema,
                            ResourceQualifier qualifier,
                            IRecord newRecord) {
        try {
            getFileFieldNames(schema).forEach(fieldName -> {
                Set<UUID> allFileIds = getFilesDescription(newRecord.getContent(), fieldName)
                        .stream()
                        .map(FileDescription::getId)
                        .collect(Collectors.toSet());

                List<File> allFiles = fileRepository.findAllByIdIn(allFileIds);

                ResourceQualifier fQualifier = new ResourceQualifier(qualifier, newRecord.getId(), fieldName);
                allFiles.stream()
                        .filter(FileService::isNotEcp)
                        .forEach(file -> {
                            String resultPath = transferFileFromTempDirectory(
                                    fQualifier,
                                    file.getPath(),
                                    getDefaultOrganizationName(authenticationFacade.getOrganizationId()),
                                    fQualifier.getType().name());

                            file.setPath(resultPath);
                        });

                addSignature(fQualifier, allFiles, schema);

                // Запишем информацию о принадлежности файлов к их ресурсу: документу или фиче.
                fileRepository.setQualifier(
                        fQualifier.getType().name(),
                        toJsonNode(new FileResourceQualifier(fQualifier.getSchema(),
                                                             fQualifier.getTable(),
                                                             fQualifier.getRecordIdAsLong(),
                                                             fQualifier.getField())),
                        allFiles.stream()
                                .map(File::getId)
                                .collect(Collectors.toSet()));
            });
        } catch (Exception e) {
            logError("Не удалось выполнить привязку файлов к сущности при создании", e);
        }
    }

    public void relateFilesByUpdate(SchemaDto schema,
                                    ResourceQualifier qualifier,
                                    IRecord newRecord,
                                    IRecord oldRecord) {
        try {
            log.debug("UPDATE CASE");

            // Из схемы достаем названия полей, в которых хранится информация о файлах ValueType.FILE
            List<String> fileFieldNames = getFileFieldNames(schema);
            if (!isChangeNeeded(newRecord, fileFieldNames)) {
                return;
            }

            Map<String, Object> oldContent = oldRecord.getContent();
            Map<String, Object> newContent = newRecord.getContent();

            log.debug("UPDATE NEEDED");
            fileFieldNames.stream()
                          .filter(fileFieldName -> isFieldEdited(newContent, fileFieldName))
                          .forEach(fieldName -> {
                              log.debug("Handle field: {}", fieldName);
                              Set<UUID> oldFileIds = new HashSet<>(getFilesIdFromField(oldContent, fieldName));
                              Set<UUID> newFileIds = new HashSet<>(getFilesIdFromField(newContent, fieldName));

                              log.debug("old ids: {}", oldFileIds);
                              log.debug("new ids: {}", newFileIds);

                              // Надо отделить процесс перемещения от подписывания
                              ResourceQualifier fQualifier = new ResourceQualifier(qualifier,
                                                                                   qualifier.getRecordIdAsLong(),
                                                                                   fieldName);
                              Set<UUID> allFileIds = getFilesDescription(newContent, fieldName)
                                      .stream()
                                      .map(FileDescription::getId)
                                      .collect(Collectors.toSet());

                              List<File> allFiles = fileRepository.findAllByIdIn(allFileIds);

                              // Перемещать нужно только основные, новые файлы
                              Set<UUID> fileIdsForTransfer = new HashSet<>(newFileIds);
                              fileIdsForTransfer.removeAll(oldFileIds);

                              allFiles.stream()
                                      .filter(file -> fileIdsForTransfer.contains(file.getId()))
                                      .collect(Collectors.toList())
                                      .forEach(file -> {
                                          String resultPath = transferFileFromTempDirectory(
                                                  fQualifier,
                                                  file.getPath(),
                                                  getDefaultOrganizationName(authenticationFacade.getOrganizationId()),
                                                  fQualifier.getType().name());

                                          file.setPath(resultPath);
                                      });

                              addSignature(fQualifier, allFiles, schema);

                              // Запишем информацию о принадлежности файлов к их ресурсу: документу или фиче.
                              fileRepository.setQualifier(
                                      fQualifier.getType().name(),
                                      toJsonNode(new FileResourceQualifier(fQualifier.getSchema(),
                                                                           fQualifier.getTable(),
                                                                           fQualifier.getRecordIdAsLong(),
                                                                           fQualifier.getField())),
                                      allFiles.stream()
                                              .filter(FileService::isNotEcp)
                                              .map(File::getId)
                                              .collect(Collectors.toSet()));

                              // закомментировано, так как решается вопрос о том каким образом будут подчищаться хвосты
                              // deleteFiles(oldFileIds, newIds);
                          });
        } catch (Exception e) {
            logError("Не удалось выполнить привязку файлов к сущности при обновлении", e);
        }
    }

    public void transferFileFromTempDirectory(File file,
                                              ResourceQualifier qualifier,
                                              String type) {
        // TODO: (1) Используется только в AcceptKptService, захардкожена первая организация "organization_1" -
        //  пересмотреть бы подход к KPT

        UUID fileId = file.getId();
        String resultPath = transferFileFromTempDirectory(qualifier,
                                                          file.getPath(),
                                                          "organization_1",
                                                          type);

        fileRepository.setPathById(resultPath, fileId);
    }

    private void addSignature(ResourceQualifier qualifier,
                              List<File> allFiles,
                              @NotNull SchemaDto schema) {
        List<File> baseFiles = allFiles.stream().filter(FileService::isNotEcp).collect(Collectors.toList());
        log.debug("baseFiles: {}", baseFiles);

        List<File> ecpFiles = allFiles.stream().filter(FileService::isEcp).collect(Collectors.toList());
        log.debug("ecpFiles: {}", ecpFiles);

        ecpFiles.forEach(ecpFile -> {
            getBaseFile(baseFiles, ecpFile).ifPresent(baseFile -> {
                UUID baseFileId = baseFile.getId();

                byte[] ecpAsBytes = new byte[0];
                try {
                    ecpAsBytes = Files.readAllBytes(Path.of(ecpFile.getPath()));
                } catch (IOException e) {
                    log.error("Не удалось добавить подпись из: '{}' к файлу: '{}' => {}",
                              baseFileId, ecpFile.getId(), e.getMessage());
                }

                if (ecpAsBytes.length > 0) {
                    baseFile.setEcp(ecpAsBytes);

                    log.debug("Файл: '{}' подписан", baseFileId);

                    fileRepository.delete(ecpFile);

                    // Из fileDescriptions вырезать подписи и обновить запись по id
                    List<FileDescription> newFileDescription = new ArrayList<>(allFiles)
                            .stream()
                            .map(file -> new FileDescription(file.getId(), file.getTitle(), file.getSize()))
                            .collect(Collectors.toList());
                    newFileDescription.removeIf(fd -> baseFiles.stream()
                                                               .filter(file -> file.getId().equals(fd.getId()))
                                                               .findFirst().isEmpty());

                    Map<String, Object> modifiedProps = new HashMap<>();
                    modifiedProps.put(qualifier.getField(), toJsonNode(newFileDescription));

                    try {
                        recordsDao.updateRecordById(qualifier, modifiedProps, schema);
                    } catch (CrgDaoException e) {
                        String msg = "Не удалось обновить информацию о файлах";
                        log.error("{} в записи: {} => {}", msg, qualifier.getQualifier(), e.getMessage(), e);

                        throw new DataServiceException(msg);
                    }
                }
            });
        });
    }

    private String transferFileFromTempDirectory(ResourceQualifier qualifier,
                                                 String currentFilePath,
                                                 String organizationName,
                                                 String type) {
        if (!currentFilePath.contains(fileStorageService.getTrashPath().toString())) {
            log.debug("Файл: {} не находится во временном хранилище. Перемещать нечего.", currentFilePath);

            return currentFilePath;
        }

        String hashCode = hashCodeAsString(new java.io.File(currentFilePath).hashCode());
        String resultFileName = String.format("%s.%s",
                                              makeFileName(qualifier, hashCode),
                                              FileNameUtils.getExtension(currentFilePath).toLowerCase());

        String pathToFile = String.format("%s/%s/%s/%s",
                                          organizationName,
                                          type.toLowerCase(),
                                          qualifier.getTable(),
                                          resultFileName);

        return fileStorageService.moveToMainStorage(Path.of(currentFilePath), Path.of(pathToFile))
                                 .toString();
    }

    private Optional<File> getBaseFile(List<File> baseFiles, File ecp) {
        return baseFiles.stream()
                        .filter(file -> ecp.getTitle().replace(".sig", "").contains(file.getTitle()))
                        .findFirst();
    }

    private static boolean isNotEcp(File file) {
        return !isEcp(file);
    }

    private static boolean isEcp(File file) {
        return file.getExtension().equals("sig");
    }

    private boolean isFieldEdited(Map<String, Object> record, String fileFieldName) {
        return record.get(fileFieldName) != null;
    }

    private boolean isChangeNeeded(IRecord newRecord, List<String> fileFieldNames) {
        return fileFieldNames.stream().anyMatch(newRecord.getContent()::containsKey);
    }
}
