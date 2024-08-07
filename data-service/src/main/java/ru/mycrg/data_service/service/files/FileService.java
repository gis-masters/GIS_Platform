package ru.mycrg.data_service.service.files;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.compress.utils.FileNameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileGroupModel;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.FileType;

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

    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;

    public FileService(FileRepository fileRepository,
                       FileStorageService fileStorageService,
                       IAuthenticationFacade authenticationFacade) {
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;
    }

    public void relateFilesByCreation(SchemaDto schema,
                                      ResourceQualifier qualifier,
                                      IRecord newRecord) {
        try {
            getFileFieldNames(schema).forEach(fieldName -> {
                FileResourceQualifier fileResQualifier = new FileResourceQualifier(qualifier.getSchema(),
                                                                                   qualifier.getTable(),
                                                                                   newRecord.getId());
                JsonNode jsonNode = toJsonNode(fileResQualifier);

                ResourceQualifier rQualifier = new ResourceQualifier(qualifier, newRecord.getId());
                rQualifier.setFieldName(fieldName);
                String type = rQualifier.getType().name();

                List<FileDescription> descriptions = getFilesDescription(newRecord.getContent(), fieldName);
                Set<UUID> ids = descriptions.stream().map(FileDescription::getId).collect(Collectors.toSet());

                fileRepository.setQualifier(type, jsonNode, ids);

                transferFilesFromTempDirectory(descriptions, rQualifier, type);
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
                              Set<UUID> oldIds = new HashSet<>(getFilesIdFromField(oldContent, fieldName));
                              Set<UUID> newIds = new HashSet<>(getFilesIdFromField(newContent, fieldName));

                              log.debug("old ids: {}", oldIds);
                              log.debug("new ids: {}", newIds);

                              Set<UUID> some = new HashSet<>(newIds);
                              some.removeAll(oldIds);

                              Set<FileDescription> descriptions = getFilesDescription(newContent, fieldName)
                                      .stream()
                                      .filter(file -> some.contains(file.getId()))
                                      .collect(Collectors.toSet());

                              qualifier.setFieldName(fieldName);

                              updateFilesInfo(descriptions, qualifier);

                              // закомментировано, так как решается вопрос о том каким образом будут подчищаться хвосты
                              // deleteFiles(oldIds, newIds);
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

        transferFileFromTempDirectory(qualifier,
                                      file.getPath(),
                                      file.getId(),
                                      "organization_1",
                                      type);
    }

    private void updateFilesInfo(Set<FileDescription> files, ResourceQualifier qualifier) {
        log.debug("files for update: {}", files);

        FileResourceQualifier fileResQualifier = new FileResourceQualifier(qualifier.getSchema(),
                                                                           qualifier.getTable(),
                                                                           qualifier.getRecordIdAsLong());
        JsonNode jsonNode = toJsonNode(fileResQualifier);

        String type = qualifier.getType().name();
        Set<UUID> ids = files.stream().map(FileDescription::getId).collect(Collectors.toSet());

        fileRepository.setQualifier(type, jsonNode, ids);

        transferFilesFromTempDirectory(new ArrayList<>(files), qualifier, type);
    }

    private void transferFilesFromTempDirectory(List<FileDescription> files,
                                                ResourceQualifier qualifier,
                                                String type) {
        Set<UUID> ids = files.stream().map(FileDescription::getId).collect(Collectors.toSet());

        fileRepository.findAllByIdIn(ids).forEach(file -> {
            transferFileFromTempDirectory(qualifier,
                                          file.getPath(),
                                          file.getId(),
                                          getDefaultOrganizationName(authenticationFacade.getOrganizationId()),
                                          type);
        });
    }

    private void transferFileFromTempDirectory(ResourceQualifier qualifier,
                                               String currentFilePath,
                                               UUID fileId,
                                               String organizationName,
                                               String type) {
        if (!currentFilePath.contains(fileStorageService.getTrashPath().toString())) {
            log.debug("Файл: {} не находится во временном хранилище. Перемещать нечего.", currentFilePath);

            return;
        }

        int hashCode = new java.io.File(currentFilePath).hashCode();

        String resultFileName = String.format("%s.%s",
                                              makeFileName(qualifier, hashCodeAsString(hashCode)),
                                              FileNameUtils.getExtension(currentFilePath).toLowerCase());

        String pathToFile = String.format("%s/%s/%s/%s",
                                          organizationName,
                                          type.toLowerCase(),
                                          qualifier.getTable(),
                                          resultFileName);

        Path resultPath = fileStorageService.moveToMainStorage(Path.of(currentFilePath), Path.of(pathToFile));

        fileRepository.setPathById(resultPath.toString(), fileId);
    }

    private boolean isFieldEdited(Map<String, Object> record, String fileFieldName) {
        return record.get(fileFieldName) != null;
    }

    private boolean isChangeNeeded(IRecord newRecord, List<String> fileFieldNames) {
        return fileFieldNames.stream().anyMatch(newRecord.getContent()::containsKey);
    }
}
