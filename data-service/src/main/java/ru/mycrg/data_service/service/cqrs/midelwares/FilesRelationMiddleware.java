package ru.mycrg.data_service.service.cqrs.midelwares;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.JsonConverter;
import ru.mycrg.data_service.service.cqrs.files.IFilesRelation;
import ru.mycrg.data_service.service.cqrs.records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.records.requests.DeleteLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.IRequestMiddleware;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.SchemaUtil.isFilePropertyExist;
import static ru.mycrg.data_service_contract.enums.ValueType.FILE;

@Component
public class FilesRelationMiddleware implements IRequestMiddleware {

    private final Logger log = LoggerFactory.getLogger(FilesRelationMiddleware.class);

    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;

    public FilesRelationMiddleware(FileRepository fileRepository,
                                   FileStorageService fileStorageService) {
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    @Override
    public <Response, Request extends IRequest<Response>> Response invoke(Request request, Next<Response> next) {
        Response response = next.invoke();

        if (!(request instanceof IFilesRelation)) {
            return response;
        }

        IFilesRelation filesRelation = (IFilesRelation) request;
        if (!isFilePropertyExist(filesRelation.getSchema())) {
            return response;
        }

        if (request instanceof CreateLibraryRecordRequest) {
            relateFilesByCreation(filesRelation, (RecordEntity) response);
        } else if (request instanceof UpdateLibraryRecordRequest) {
            relateFilesByUpdate((UpdateLibraryRecordRequest) request);
        } else if (request instanceof DeleteLibraryRecordRequest) {
            IRecord record = ((DeleteLibraryRecordRequest) request).getRecord();

            deleteRelatedFiles(filesRelation, record);
        } else {
            log.warn("Unknown request type");
        }

        return response;
    }

    private void relateFilesByCreation(IFilesRelation filesRelation, RecordEntity newRecord) {
        try {
            SchemaDto schema = filesRelation.getSchema();

            Set<UUID> ids = getFileFieldNames(schema)
                    .stream()
                    .flatMap(fileFieldName -> getFilesIdFromField(newRecord.getContent(), fileFieldName).stream())
                    .collect(Collectors.toSet());

            if (!ids.isEmpty()) {
                ResourceQualifier rQualifier = filesRelation.getQualifier();
                FileResourceQualifier fileResQualifier = new FileResourceQualifier(rQualifier.getSchema(),
                                                                                   rQualifier.getTable(),
                                                                                   newRecord.getId());
                JsonNode jsonNode = JsonConverter.toJsonNode(fileResQualifier);

                fileRepository.setQualifier(new ResourceQualifier(rQualifier, newRecord.getId()).getType().name(),
                                            jsonNode, ids);
            }
        } catch (Exception e) {
            logError("Не удалось выполнить привязку файлов к сущности при создании", e);
        }
    }

    private void relateFilesByUpdate(UpdateLibraryRecordRequest request) {
        try {
            log.debug("UPDATE CASE");

            IRecord newRecord = request.getNewRecord();
            SchemaDto schema = request.getSchema();

            List<String> fileFieldNames = getFileFieldNames(schema);
            if (!isChangeNeeded(newRecord, fileFieldNames)) {
                return;
            }

            log.debug("UPDATE NEEDED");
            IRecord oldRecord = request.getOldRecord();
            Set<UUID> oldIds = fileFieldNames
                    .stream()
                    .flatMap(fileFieldName -> getFilesIdFromField(oldRecord.getContent(), fileFieldName).stream())
                    .collect(Collectors.toSet());

            Set<UUID> newIds = fileFieldNames
                    .stream()
                    .flatMap(fileFieldName -> getFilesIdFromField(newRecord.getContent(), fileFieldName).stream())
                    .collect(Collectors.toSet());

            log.debug("old ids: {}", oldIds);
            log.debug("new ids: {}", newIds);

            HashSet<UUID> unionIds = new HashSet<>(oldIds);
            unionIds.addAll(newIds);

            updateFilesInfo(unionIds, request.getQualifier());
            deleteFiles(oldIds, newIds);
        } catch (Exception e) {
            logError("Не удалось выполнить привязку файлов к сущности при обновлении", e);
        }
    }

    private void deleteFiles(Set<UUID> oldIds, Set<UUID> newIds) {
        oldIds.stream()
              .filter(oldId -> !newIds.contains(oldId))
              .collect(Collectors.toSet())
              .forEach(this::deleteFile);
    }

    private void deleteFile(UUID id) {
        log.debug("Tr to  delete file by id: '{}'", id);

        Optional<File> oFile = fileRepository.findById(id);
        if (oFile.isPresent()) {
            File file = oFile.get();
            String path = file.getPath();

            try {
                fileStorageService.deleteIfExists(path);
            } catch (StorageException e) {
                log.error("Не удалось удалить файл с диска, по пути: '{}'", path);
            }

            fileRepository.delete(file);
        } else {
            log.info("Нечего удалять. Файл не найден по идентификатору: '{}'", id);
        }
    }

    private void updateFilesInfo(Set<UUID> ids, ResourceQualifier rQualifier) {
        log.debug("for update id: {}", ids);

        FileResourceQualifier fileResQualifier = new FileResourceQualifier(rQualifier.getSchema(),
                                                                           rQualifier.getTable(),
                                                                           rQualifier.getRecord());
        JsonNode jsonNode = JsonConverter.toJsonNode(fileResQualifier);

        fileRepository.setQualifier(rQualifier.getType().name(), jsonNode, ids);
    }

    private boolean isChangeNeeded(IRecord newRecord, List<String> fileFieldNames) {
        return fileFieldNames.stream().anyMatch(newRecord.getContent()::containsKey);
    }

    private void deleteRelatedFiles(IFilesRelation filesRelation, IRecord record) {
        try {
            log.debug("DELETE CASE: {}", record.getId());

            getFileFieldNames(filesRelation.getSchema())
                    .stream()
                    .flatMap(fileFieldName -> getFilesIdFromField(record.getContent(), fileFieldName).stream())
                    .collect(Collectors.toSet())
                    .forEach(this::deleteFile);
        } catch (Exception e) {
            logError("Не удалось выполнить удаление файлов при удалении записи: " + record.getId(), e);
        }
    }

    private List<UUID> getFilesIdFromField(Map<String, Object> record, String fileFieldName) {
        Object payload = record.get(fileFieldName);
        if (payload != null) {
            try {
                List<FileDescription> descriptions = mapper.readValue(payload.toString(),
                                                                      new TypeReference<List<FileDescription>>() {
                                                                      });
                return descriptions.stream()
                                   .map(FileDescription::getId)
                                   .collect(Collectors.toList());
            } catch (IOException e) {
                String msg = "Содержимое поля типа FILE имеет не корректное тело: " + payload;
                logError(msg, e);

                return new ArrayList<>();
            }
        } else {
            return new ArrayList<>();
        }
    }

    @NotNull
    private List<String> getFileFieldNames(SchemaDto schema) {
        return schema.getProperties().stream()
                     .filter(property -> property.getValueType().equals(FILE))
                     .map(SimplePropertyDto::getName)
                     .collect(Collectors.toList());
    }
}
