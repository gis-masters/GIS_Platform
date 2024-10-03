package ru.mycrg.data_service.service.files;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.FileGroupModel;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.EcpVerifier;
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

import static org.apache.commons.io.FilenameUtils.getExtension;
import static ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse.verificationFailed;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultOrganizationName;
import static ru.mycrg.data_service.service.files.FileUtil.*;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.fieldQualifier;
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
    private final EcpVerifier ecpVerifier;
    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;

    public FileService(RecordsDao recordsDao,
                       EcpVerifier ecpVerifier,
                       FileRepository fileRepository,
                       FileStorageService fileStorageService,
                       IAuthenticationFacade authenticationFacade) {
        this.recordsDao = recordsDao;
        this.ecpVerifier = ecpVerifier;
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;
    }

    public Map<UUID, VerifyEcpResponse> relateFiles(SchemaDto schema,
                                                    ResourceQualifier qualifier,
                                                    IRecord newRecord) {
        Map<UUID, VerifyEcpResponse> result = new HashMap<>();

        try {
            for (String fieldName: getFileFieldNames(schema)) {
                Set<UUID> allFileIds = getFilesDescription(newRecord.getContent(), fieldName)
                        .stream()
                        .map(FileDescription::getId)
                        .collect(Collectors.toSet());

                List<File> allFoundsFiles = fileRepository.findAllByIdIn(allFileIds);
                Set<UUID> allFoundFilesIds = allFoundsFiles.stream().map(File::getId).collect(Collectors.toSet());
                allFileIds.stream()
                          .filter(fileId -> !allFoundFilesIds.contains(fileId))
                          .forEach(fileId -> {
                              result.put(fileId, verificationFailed("Файл не найден"));
                          });

                ResourceQualifier fQualifier = fieldQualifier(qualifier, newRecord.getId(), fieldName);
                allFoundsFiles.stream()
                              .filter(FileService::isNotEcp)
                              .forEach(file -> {
                                  String resultPath = transferFileFromTempDirectory(
                                          fQualifier,
                                          file.getPath(),
                                          getDefaultOrganizationName(authenticationFacade.getOrganizationId()),
                                          fQualifier.getType().name());

                                  file.setPath(resultPath);
                              });

                Map<UUID, VerifyEcpResponse> signatureReport = addSignature(fQualifier, allFoundsFiles, schema);
                result.putAll(signatureReport);

                // Запишем информацию о принадлежности файлов к их ресурсу: документу или фиче.
                fileRepository.setQualifier(
                        fQualifier.getType().name(),
                        toJsonNode(new FileResourceQualifier(fQualifier.getSchema(),
                                                             fQualifier.getTable(),
                                                             fQualifier.getRecordIdAsLong(),
                                                             fQualifier.getField())),
                        allFoundFilesIds);
            }
        } catch (Exception e) {
            logError("Не удалось выполнить привязку файлов к сущности при создании", e);
        }

        return result;
    }

    public Map<UUID, VerifyEcpResponse> relateFilesByUpdate(SchemaDto schema,
                                                            ResourceQualifier qualifier,
                                                            IRecord newRecord,
                                                            IRecord oldRecord) {
        Map<UUID, VerifyEcpResponse> result = new HashMap<>();

        try {
            // Из схемы достаем названия полей, в которых хранится информация о файлах ValueType.FILE
            List<String> fileFieldNames = getFileFieldNames(schema);
            if (!isChangeNeeded(newRecord, fileFieldNames)) {
                return Map.of();
            }

            Map<String, Object> oldContent = oldRecord.getContent();
            Map<String, Object> newContent = newRecord.getContent();

            for (String fieldName: fileFieldNames) {
                if (!isFieldEdited(newContent, fieldName)) {
                    continue;
                }

                log.debug("Обработка поля: '{}'", fieldName);
                Set<UUID> oldFileIds = new HashSet<>(getFilesIdFromField(oldContent, fieldName));
                Set<FileDescription> newFilesDescriptions = new HashSet<>(getFilesDescription(newContent, fieldName));
                Set<UUID> newFileIds = newFilesDescriptions.stream()
                                                           .map(FileDescription::getId)
                                                           .collect(Collectors.toSet());

                log.debug("Список старых файлов: {}", oldFileIds);
                log.debug("Список новых  файлов: {}", newFileIds);

                // Надо отделить процесс перемещения от подписывания
                // ПЕРЕМЕЩЕНИЕ - Перемещать нужно только основные, новые файлы
                Set<UUID> fileIdsForTransfer = newFilesDescriptions
                        .stream()
                        .filter(fileDescription -> !getExtension(fileDescription.getTitle()).equalsIgnoreCase("sig"))
                        .map(FileDescription::getId)
                        .collect(Collectors.toSet());

                fileIdsForTransfer.removeAll(oldFileIds);

                Set<UUID> allFileIds = getFilesDescription(newContent, fieldName)
                        .stream()
                        .map(FileDescription::getId)
                        .collect(Collectors.toSet());

                List<File> allFiles = fileRepository.findAllByIdIn(allFileIds);
                List<File> allFoundsFiles = fileRepository.findAllByIdIn(allFileIds);
                Set<UUID> allFoundFilesIds = allFoundsFiles.stream().map(File::getId).collect(Collectors.toSet());
                for (UUID fileId: allFileIds) {
                    if (!allFoundFilesIds.contains(fileId)) {
                        result.put(fileId, verificationFailed("Файл не найден"));
                    }
                }

                ResourceQualifier fQualifier = fieldQualifier(qualifier, qualifier.getRecordIdAsLong(), fieldName);
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

                // ПОДПИСЫВАНИЕ
                Map<UUID, VerifyEcpResponse> signatureReport = addSignature(fQualifier, allFoundsFiles, schema);
                result.putAll(signatureReport);

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
            }
        } catch (Exception e) {
            logError("Не удалось выполнить привязку файлов к сущности при обновлении", e);
        }

        return result;
    }

    // TODO: выкинуть из всех файлов те ЭЦП, что не проходят проверку или не имеют основного файла
    // Нужно найти основной файл для ЭЦП, сначала в новых файлах, затем во всех файлах - если ЭЦП
    // добавляется позже основного файла.
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

    private Map<UUID, VerifyEcpResponse> addSignature(ResourceQualifier qualifier,
                                                      List<File> allFiles,
                                                      @NotNull SchemaDto schema) {
        Map<UUID, VerifyEcpResponse> report = new HashMap<>();

        List<File> baseFiles = allFiles.stream().filter(FileService::isNotEcp).collect(Collectors.toList());
        log.debug("Базовые файлы: {}", baseFiles);

        List<File> ecpFiles = allFiles.stream().filter(FileService::isEcp).collect(Collectors.toList());
        log.debug("Файлы ЭЦП: {}", ecpFiles);

        for (File ecpFile: ecpFiles) {
            UUID ecpFileId = ecpFile.getId();
            Optional<File> oBaseFile = getBaseFile(baseFiles, ecpFile.getTitle());
            if (oBaseFile.isPresent()) { // Для ЭЦП нашли базовый файл... подписываем и удаляем ЭЦП
                File baseFile = oBaseFile.get();

                byte[] ecpAsBytes = getEcpAsBytes(ecpFile);

                VerifyEcpResponse verifyEcpResponse = ecpVerifier.verify(baseFile.getPath(), ecpAsBytes);
                if (verifyEcpResponse.isVerified()) {
                    baseFile.setEcp(ecpAsBytes);

                    log.debug("Файл: '{}' подписан ЭЦП: '{}'", baseFile.getId(), ecpFileId);
                } else {
                    log.debug("Файл: '{}' НЕ подписан. ЭЦП: '{}' не прошла проверку: {}",
                              baseFile.getId(), ecpFileId, verifyEcpResponse);
                }

                // Добавим ЭЦП в отчет
                report.put(ecpFileId, verifyEcpResponse);

                // Удалим ЭЦП файл
                fileRepository.delete(ecpFile);
            } else { // Не нашли базовый файл.
                log.debug("Для ЭЦП: '{}' не найден базовый файл", ecpFileId);

                // Добавим ЭЦП в отчет
                report.put(ecpFileId, verificationFailed("Не найден базовый файл"));

                // Удалим ЭЦП файл
                fileRepository.delete(ecpFile);
            }
        }

        // После всего обновляем запись только базовыми файлами
        List<FileDescription> allFilesAsDescription = new ArrayList<>(baseFiles)
                .stream()
                .map(file -> new FileDescription(file.getId(), file.getTitle(), file.getSize()))
                .collect(Collectors.toList());

        Map<String, Object> modifiedProps = new HashMap<>();
        JsonNode payload = toJsonNode(allFilesAsDescription);
        modifiedProps.put(qualifier.getField(), payload);

        try {
            recordsDao.updateRecordById(qualifier, modifiedProps, schema);
        } catch (CrgDaoException e) {
            String msg = "Не удалось обновить информацию о файлах";
            log.error("{} в записи: {} => {}", msg, qualifier.getQualifier(), e.getMessage());

            throw new DataServiceException(msg);
        }

        return report;
    }

    private byte[] getEcpAsBytes(File ecpFile) {
        byte[] ecpAsBytes;
        try {
            ecpAsBytes = Files.readAllBytes(Path.of(ecpFile.getPath()));
        } catch (IOException e) {
            String msg = "Не удалось прочитать подпись из файла: " + ecpFile.getId();

            log.error("{} => {}", msg, e.getMessage(), e);

            throw new DataServiceException(msg);
        }

        if (ecpAsBytes.length > 0) {
            return ecpAsBytes;
        } else {
            throw new DataServiceException("Файл подписи пуст: " + ecpFile.getId());
        }
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
                                              getExtension(currentFilePath).toLowerCase());

        String pathToFile = String.format("%s/%s/%s/%s",
                                          organizationName,
                                          type.toLowerCase(),
                                          qualifier.getTable(),
                                          resultFileName);

        return fileStorageService.moveToMainStorage(Path.of(currentFilePath), Path.of(pathToFile))
                                 .toString();
    }

    private Optional<File> getBaseFile(List<File> baseFiles, String title) {
        return baseFiles.stream()
                        .filter(file -> title.replace(".sig", "").contains(file.getTitle()))
                        .findFirst();
    }

    private static boolean isNotEcp(File file) {
        return !isEcp(file);
    }

    private static boolean isEcp(File file) {
        return file.getExtension().equalsIgnoreCase("sig");
    }

    private boolean isFieldEdited(Map<String, Object> record, String fileFieldName) {
        return record.get(fileFieldName) != null;
    }

    private boolean isChangeNeeded(IRecord newRecord, List<String> fileFieldNames) {
        return fileFieldNames.stream().anyMatch(newRecord.getContent()::containsKey);
    }
}
