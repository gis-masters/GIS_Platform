package ru.mycrg.data_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.compress.utils.FileNameUtils;
import org.apache.commons.io.FilenameUtils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultOrganizationName;
import static ru.mycrg.common_utils.CrgGlobalProperties.join;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service_contract.enums.ValueType.FILE;

@Service
@Transactional
public class FileService {

    private final Logger log = LoggerFactory.getLogger(FileService.class);

    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;

    private final Path fileStoragePath;

    public FileService(Environment environment,
                       FileRepository fileRepository,
                       FileStorageService fileStorageService,
                       IAuthenticationFacade authenticationFacade) {
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;

        String path = environment.getRequiredProperty("crg-options.fileStoragePath");

        fileStoragePath = Paths.get(path).toAbsolutePath().normalize();
    }

    public void setQualifier(String type, JsonNode jsonNode, Set<UUID> ids) {
        fileRepository.setQualifier(type, jsonNode, ids);
    }

    public List<File> findAllByIdIn(Set<UUID> ids) {
        return fileRepository.findAllByIdIn(ids);
    }

    public void setPathById(String path, UUID id) {
        fileRepository.setPathById(path, id);
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

                setQualifier(type, jsonNode, ids);

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

    @NotNull
    private List<String> getFileFieldNames(SchemaDto schema) {
        return schema.getProperties().stream()
                     .filter(property -> property.getValueTypeAsEnum().equals(FILE))
                     .map(SimplePropertyDto::getName)
                     .collect(Collectors.toList());
    }

    private List<FileDescription> getFilesDescription(Map<String, Object> record, String fieldName) {
        Object payload = record.get(fieldName);
        if (payload != null) {
            try {
                return mapper.readValue(payload.toString(),
                                        new TypeReference<List<FileDescription>>() {
                                        });
            } catch (IOException e) {
                String msg = "Содержимое поля типа FILE имеет не корректное тело: " + payload;
                logError(msg, e);

                return new ArrayList<>();
            }
        } else {
            return new ArrayList<>();
        }
    }

    private void updateFilesInfo(Set<FileDescription> files, ResourceQualifier qualifier) {
        log.debug("files for update: {}", files);

        FileResourceQualifier fileResQualifier = new FileResourceQualifier(qualifier.getSchema(),
                                                                           qualifier.getTable(),
                                                                           qualifier.getRecordIdAsLong());
        JsonNode jsonNode = toJsonNode(fileResQualifier);

        String type = qualifier.getType().name();
        Set<UUID> ids = files.stream().map(FileDescription::getId).collect(Collectors.toSet());

        setQualifier(type, jsonNode, ids);

        transferFilesFromTempDirectory(new ArrayList<>(files), qualifier, type);
    }

    private boolean isChangeNeeded(IRecord newRecord, List<String> fileFieldNames) {
        return fileFieldNames.stream().anyMatch(newRecord.getContent()::containsKey);
    }

    private List<UUID> getFilesIdFromField(Map<String, Object> record, String fileFieldName) {
        return getFilesDescription(record, fileFieldName)
                .stream()
                .map(FileDescription::getId)
                .collect(Collectors.toList());
    }

    private boolean isFieldEdited(Map<String, Object> record, String fileFieldName) {
        return record.get(fileFieldName) != null;
    }

    private void transferFilesFromTempDirectory(List<FileDescription> files,
                                                ResourceQualifier qualifier,
                                                String type) {
        Set<UUID> ids = files.stream().map(FileDescription::getId).collect(Collectors.toSet());

        findAllByIdIn(ids).forEach(file -> {
            Optional<FileDescription> description = files
                    .stream()
                    .filter(fileDescription -> fileDescription.getId().equals(file.getId()))
                    .findFirst();

            String fileName = description.get().getTitle();
            String resultFileName = String.format("%s.%s",
                                                  makeFileName(qualifier, FilenameUtils.removeExtension(fileName)),
                                                  FileNameUtils.getExtension(fileName).toLowerCase());

            Path targetPath = fileStoragePath.resolve(
                    String.format("%s/%s/%s/%s",
                                  getDefaultOrganizationName(authenticationFacade.getOrganizationId()),
                                  type.toLowerCase(),
                                  qualifier.getTable(),
                                  resultFileName));

            fileStorageService.moveFile(Path.of(file.getPath()), targetPath);

            setPathById(targetPath.toString(), file.getId());
        });
    }

    private String makeFileName(ResourceQualifier qualifier, String title) {
        String recordId = "undefinedRecordId";
        if (qualifier.getRecordId() == null) {
            log.warn("Не установлен recordId у квалификатора ресурса: [{}]", qualifier);
        } else {
            recordId = qualifier.getRecordId().toString();
        }

        String fieldName = "undefinedFieldName";
        if (qualifier.getFieldName() == null) {
            log.warn("Не установлено fieldName у квалификатора ресурса: [{}]", qualifier.getQualifier());
        } else {
            fieldName = qualifier.getFieldName();
        }

        // Немного обезопасит от одинаковых хеш кодов для коротких строк, например "Aa" = "BB"
        int hashCode = (title.hashCode() + String.valueOf(
                new StringBuilder(title).reverse().toString().hashCode())).hashCode();

        return join(recordId, fieldName, String.valueOf(hashCode > 0 ? hashCode : hashCode * -1));
    }
}
