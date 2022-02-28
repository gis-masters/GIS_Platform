package ru.mycrg.data_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.FileProjection;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.cqrs.files.requests.CreateFileRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.mediator.Mediator;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.stream.Collectors.toMap;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpHeaders.CONTENT_LENGTH;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@RestController
public class FileController extends BaseController {

    private final Mediator mediator;
    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final Map<ResourceType, IResourceProtector> protectors;

    public FileController(Mediator mediator,
                          FileRepository fileRepository,
                          List<IResourceProtector> protectors,
                          FileStorageService fileStorageService) {
        this.mediator = mediator;
        this.fileStorageService = fileStorageService;
        this.fileRepository = fileRepository;

        this.protectors = protectors.stream()
                                    .collect(toMap(IResourceProtector::getType, Function.identity()));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping(value = "/files")
    public ResponseEntity<Object> createFile(@RequestPart MultipartFile[] files) {
        validateRequest(files);

        List<FileProjection> projections = mediator.execute(new CreateFileRequest(files));

        return ResponseEntity.status(CREATED)
                             .body(projections);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}")
    public ResponseEntity<Object> getFile(@PathVariable UUID id) {
        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        checkPermissions(file);

        return ResponseEntity.status(OK)
                             .body(file);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID id,
                                                 HttpServletRequest request) {
        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));

        checkPermissions(file);

        try {
            ContentDisposition contentDisposition = ContentDisposition.builder("attachment")
                                                                      .filename(file.getTitle(), UTF_8)
                                                                      .build();

            Resource resource = fileStorageService.loadAsResource(file.getPath());

            return ResponseEntity.ok()
                                 .contentType(MediaType.parseMediaType(defineFileContentType(request, resource)))
                                 .header(CONTENT_DISPOSITION, contentDisposition.toString())
                                 .header(CONTENT_LENGTH, file.getSize().toString())
                                 .body(resource);
        } catch (NoSuchFileStorageException e) {
            String msg = String.format("Файл недоступен по указанному пути: %s", file.getPath());
            logError(msg, e);

            throw new NotFoundException(msg, e.getCause());
        } catch (MalformedURLStorageException e) {
            String msg = String.format("Задан некорректный путь к файлу: %s", file.getPath());
            logError(msg, e);

            throw new DataServiceException(msg, e.getCause());
        } catch (Exception e) {
            String msg = "Что-то пошло не так при попытке скачивания файла: " + file;
            logError(msg, e);

            throw new DataServiceException(msg, e.getCause());
        }
    }

    private void validateRequest(MultipartFile[] files) {
        if (files.length == 0) {
            throw new BadRequestException("Требуемая часть запроса 'files' отсутствует");
        }

        MultipartFile firstFile = files[0];
        if (firstFile != null) {
            String filename = firstFile.getOriginalFilename();
            if (filename == null || filename.isBlank()) {
                throw new BadRequestException("Требуемая часть запроса 'files' отсутствует");
            }
        }
    }

    private void checkPermissions(File file) {
        String resourceType = file.getResourceType();
        JsonNode resourceQualifier = file.getResourceQualifier();
        if (resourceType == null || resourceQualifier == null) {
            throw new ForbiddenException("Файл недоступен. Ресурс не указан.");
        }

        FileResourceQualifier frQualifier;
        try {
            frQualifier = mapper.readValue(resourceQualifier.toString(), FileResourceQualifier.class);
        } catch (IOException e) {
            String msg = "Некорректно сформирован квалификатор ресурса";
            logError(msg, e);

            throw new DataServiceException(msg);
        }

        ResourceQualifier rQualifier = new ResourceQualifier(frQualifier.getSchema(),
                                                             frQualifier.getTable(),
                                                             frQualifier.getRecordId(),
                                                             ResourceType.valueOf(resourceType));
        IResourceProtector resourceProtector = protectors.get(ResourceType.valueOf(resourceType));
        resourceProtector.throwIfNotExist(rQualifier);
        if (!resourceProtector.isAllowed(rQualifier)) {
            throw new ForbiddenException("Файл недоступен");
        }
    }
}
