package ru.mycrg.data_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileProjection;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.mappers.FileResourceQualifierMapper;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service.service.cqrs.files.requests.CreateFileRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.mediator.Mediator;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpHeaders.CONTENT_LENGTH;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@RestController
public class FileController extends BaseController {

    private final Mediator mediator;
    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;
    private final IMasterResourceProtector resourceProtector;
    private final OrgSettingsKeeper orgSettingsKeeper;

    private final Logger log = LoggerFactory.getLogger(FileController.class);

    public FileController(Mediator mediator,
                          FileRepository fileRepository,
                          FileStorageService fileStorageService,
                          IAuthenticationFacade authenticationFacade,
                          MasterResourceProtector resourceProtector,
                          OrgSettingsKeeper orgSettingsKeeper) {
        this.mediator = mediator;
        this.fileStorageService = fileStorageService;
        this.fileRepository = fileRepository;
        this.authenticationFacade = authenticationFacade;
        this.resourceProtector = resourceProtector;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping(value = "/files")
    public ResponseEntity<List<FileProjection>> createFile(@RequestPart MultipartFile[] files) {
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
        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

        return ResponseEntity.status(OK)
                             .body(file);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID id,
                                                 HttpServletRequest request) {
        orgSettingsKeeper.throwIfDownloadFileNotAllowed();

        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));

        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

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

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/download/zip")
    public void downloadZip(@PathVariable UUID id, HttpServletResponse response) {
        orgSettingsKeeper.throwIfDownloadFileNotAllowed();

        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));

        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

        String fileBaseTitle = FilenameUtils.getBaseName(file.getTitle());
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", ContentDisposition.builder("attachment")
                                                                    .filename(fileBaseTitle + ".zip", UTF_8)
                                                                    .build().toString());

        try (ServletOutputStream sos = response.getOutputStream();
             ZipOutputStream zos = new ZipOutputStream(sos)) {
            String filePathBase = FilenameUtils.removeExtension(file.getPath());

            fileRepository.getFilePathsByPathBase(filePathBase)
                          .stream().map(Paths::get)
                          .forEach(path -> makeZipArchive(path, zos, fileBaseTitle));
        } catch (Exception ex) {
            String msg = String.format("Не удалось создать zip архив. Причина: %s", ex.getMessage());
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    private void makeZipArchive(Path path, ZipOutputStream zos, String fileName) {
        try {
            // Создание новой записи ZIP и добавление её в поток
            String fileNameWithExtension =
                    String.format("%s.%s", fileName, FilenameUtils.getExtension(path.getFileName().toString()));
            ZipEntry zipEntry = new ZipEntry(fileNameWithExtension);

            // Чтение файла и запись его в ZIP-архив
            try (InputStream fis = Files.newInputStream(path)) {
                zos.putNextEntry(zipEntry);

                byte[] buffer = new byte[1024];
                int length;
                while ((length = fis.read(buffer)) >= 0) {
                    zos.write(buffer, 0, length);
                }
            } catch (NoSuchFileException ex) {
                String msg = String.format("Не удалось добавить файл %s в архив. Файл не найден по пути: %s",
                                           path.getFileName(),
                                           ex.getMessage());
                log.error(msg);
            }
            // Закрытие текущей записи ZIP
            zos.closeEntry();
        } catch (Exception e) {
            String msg = String.format("Не удалось добавить файл %s в архив. Причина: %s",
                                       path.getFileName(),
                                       e.getMessage());

            throw new DataServiceException(msg);
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

    private void throwIfResourceNotAllowed(File file) {
        String resourceType = file.getResourceType();
        JsonNode resourceQualifier = file.getResourceQualifier();
        if (resourceType == null || resourceQualifier == null) {
            throw new ForbiddenException("Файл недоступен. Ресурс не указан.");
        }

        FileResourceQualifier frQualifier = FileResourceQualifierMapper.mapToFileQualifier(resourceQualifier);

        ResourceQualifier rQualifier = new ResourceQualifier(frQualifier.getSchema(),
                                                             frQualifier.getTable(),
                                                             frQualifier.getRecordId(),
                                                             ResourceType.valueOf(resourceType));
        resourceProtector.throwIfNotExist(rQualifier);
        if (!resourceProtector.isAllowed(rQualifier)) {
            throw new ForbiddenException("Файл недоступен");
        }
    }
}
