package ru.mycrg.data_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.dto.FileProjection;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.*;
import ru.mycrg.data_service.mappers.FileResourceQualifierMapper;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service.service.cqrs.files.requests.CreateFileRequest;
import ru.mycrg.data_service.service.ecp.EcpVerifier;
import ru.mycrg.data_service.service.ecp.FileSigner;
import ru.mycrg.data_service.service.ecp.HashCalculator;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.FileStorageSizeGuarder;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.mediator.Mediator;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipOutputStream;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpHeaders.CONTENT_LENGTH;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.files.FileService.fileGroups;
import static ru.mycrg.data_service.service.files.FileUtil.getFileAsBytes;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.StringUtil.setToLowerCase;

@RestController
public class FileController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(FileController.class);

    private final Mediator mediator;
    private final EcpVerifier ecpVerifier;
    private final HashCalculator hashCalculator;
    private final FileSigner fileSigner;
    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final FileStorageSizeGuarder fileStorageSizeGuarder;
    private final IAuthenticationFacade authenticationFacade;
    private final IMasterResourceProtector resourceProtector;
    private final OrgSettingsKeeper orgSettingsKeeper;

    public FileController(Mediator mediator,
                          EcpVerifier ecpVerifier,
                          HashCalculator hashCalculator,
                          FileSigner fileSigner,
                          FileRepository fileRepository,
                          FileStorageService fileStorageService,
                          FileStorageSizeGuarder fileStorageSizeGuarder,
                          IAuthenticationFacade authenticationFacade,
                          MasterResourceProtector resourceProtector,
                          OrgSettingsKeeper orgSettingsKeeper) {
        this.mediator = mediator;
        this.ecpVerifier = ecpVerifier;
        this.hashCalculator = hashCalculator;
        this.fileSigner = fileSigner;
        this.fileStorageService = fileStorageService;
        this.fileRepository = fileRepository;
        this.fileStorageSizeGuarder = fileStorageSizeGuarder;
        this.authenticationFacade = authenticationFacade;
        this.resourceProtector = resourceProtector;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping(value = "/files")
    public ResponseEntity<List<FileProjection>> createFile(@RequestPart MultipartFile[] files) {
        validateRequest(files);
        if (fileStorageSizeGuarder.isTooLarge(files)) {
            throw new PayloadTooLargeException();
        }

        List<FileProjection> projections = mediator.execute(new CreateFileRequest(files));

        return ResponseEntity.status(CREATED)
                             .body(projections);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}")
    public ResponseEntity<FileProjection> getFile(@PathVariable UUID id) {
        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

        return ResponseEntity.ok(new FileProjection(file));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/files/{id}/sign")
    public ResponseEntity<?> sign(@PathVariable UUID id,
                                  @RequestPart MultipartFile sign) {
        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

        fileSigner.sign(file, sign);

        return ResponseEntity.ok().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/verify")
    public ResponseEntity<List<VerifyEcpResponse>> verifyFile(@PathVariable UUID id) {
        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

        if (file.getEcp() == null) {
            throw new BadRequestException("Файл: '" + file.getTitle() + "' не подписан");
        }

        List<VerifyEcpResponse> result = ecpVerifier.verify(file.getPath(), file.getEcp());

        return ResponseEntity.ok(result);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{fileId}/verify/{ecpId}")
    public ResponseEntity<List<VerifyEcpResponse>> verifyFileByEcp(@PathVariable UUID fileId,
                                                                   @PathVariable UUID ecpId) {
        File file = fileRepository.findById(fileId)
                                  .orElseThrow(() -> new NotFoundException(fileId));
        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

        File ecp = fileRepository.findById(ecpId)
                                 .orElseThrow(() -> new NotFoundException(ecpId));
        if (!authenticationFacade.getLogin().equalsIgnoreCase(ecp.getCreatedBy())) {
            throwIfResourceNotAllowed(ecp);
        }

        List<VerifyEcpResponse> result = ecpVerifier.verify(file.getPath(), getFileAsBytes(ecp));

        return ResponseEntity.ok(result);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/hash")
    public ResponseEntity<String> calculateHash(@PathVariable UUID id) {
        log.info("Запрос hash для файла: {}", id);

        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

        String hash = hashCalculator.calculate(file.getPath());

        return ResponseEntity.ok(hash);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID id,
                                                 HttpServletRequest request) {
        File file = getFileOrThrow(id);

        try {
            ContentDisposition contentDisposition = ContentDisposition.builder("attachment")
                                                                      .filename(file.getTitle(), UTF_8)
                                                                      .build();

            Resource resource = fileStorageService.loadFromMainStorage(file.getPath());

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
    @GetMapping("/files/{id}/download/ecp")
    public ResponseEntity<Resource> downloadEcp(@PathVariable UUID id) {
        File file = getFileOrThrow(id);
        byte[] ecp = file.getEcp();
        if (ecp == null) {
            throw new BadRequestException("Файл не подписан");
        }

        try {
            ContentDisposition contentDisposition = ContentDisposition.builder("attachment")
                                                                      .filename(file.getTitle() + ".sig", UTF_8)
                                                                      .build();

            return ResponseEntity.ok()
                                 .contentType(MediaType.parseMediaType("application/pgp-signature"))
                                 .header(CONTENT_DISPOSITION, contentDisposition.toString())
                                 .header(CONTENT_LENGTH, String.valueOf(ecp.length))
                                 .body(new ByteArrayResource(ecp));
        } catch (Exception e) {
            String msg = "Что-то пошло не так при попытке скачивания ЭЦП файла: " + file;
            logError(msg, e);

            throw new DataServiceException(msg, e.getCause());
        }
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/download/with-ecp")
    public void downloadFileWithEcp(@PathVariable UUID id, HttpServletResponse response) {
        File file = getFileOrThrow(id);
        byte[] ecp = file.getEcp();
        if (ecp == null) {
            throw new BadRequestException("Файл не подписан");
        }

        String fileBaseTitle = FilenameUtils.getBaseName(file.getTitle());

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", ContentDisposition.builder("attachment")
                                                                    .filename(fileBaseTitle + ".zip", UTF_8)
                                                                    .build().toString());

        try (ServletOutputStream sos = response.getOutputStream(); ZipOutputStream zos = new ZipOutputStream(sos)) {
            try {
                addStreamToZip(zos, Files.newInputStream(Path.of(file.getPath())), file.getTitle());
                addStreamToZip(zos, new ByteArrayResource(ecp).getInputStream(), file.getTitle() + ".sig");

                zos.closeEntry();
            } catch (Exception e) {
                String msg = String.format("Не удалось сформировать архив с ЭЦП для файла: %s. Причина: %s",
                                           file.getPath(), e.getMessage());

                throw new DataServiceException(msg);
            }
        } catch (Exception ex) {
            String msg = String.format("Не удалось создать zip архив файл+ЭЦП. Причина: %s", ex.getMessage());
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/download/zip")
    public void downloadZip(@PathVariable UUID id, HttpServletResponse response) {
        File baseFile = getFileOrThrow(id);

        Optional<FileType> oType = FileType.parse(baseFile.getExtension());
        if (oType.isEmpty()) {
            throw new BadRequestException("Выгрузка архивом не поддерживается для данного файла.");
        }

        Set<String> fileFullGroup = Optional
                .of(fileGroups.get(oType.get()))
                .orElseThrow(() -> new BadRequestException("Не найдено описание типа для файла: " + oType.get()))
                .getFull();

        String fileBaseTitle = FilenameUtils.getBaseName(baseFile.getTitle());
        String tmpPath = FilenameUtils.removeExtension(baseFile.getPath()).split("__")[0];
        List<File> allFiles = fileRepository.oneGroupFiles(tmpPath, fileBaseTitle.toLowerCase(), fileFullGroup);

        throwIfGroupNotFull(fileGroups.get(oType.get()).getRequired(), allFiles);

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", ContentDisposition.builder("attachment")
                                                                    .filename(fileBaseTitle + ".zip", UTF_8)
                                                                    .build().toString());

        makeZip(response, allFiles, fileBaseTitle, false);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/files/{id}/download/zip/with-ecp")
    public void downloadZipWithEcp(@PathVariable UUID id, HttpServletResponse response) {
        File baseFile = getFileOrThrow(id);

        Optional<FileType> oType = FileType.parse(baseFile.getExtension());
        if (oType.isEmpty()) {
            throw new BadRequestException("Выгрузка архивом не поддерживается для данного файла.");
        }

        Set<String> fileFullGroup = Optional
                .of(fileGroups.get(oType.get()))
                .orElseThrow(() -> new BadRequestException("Не найдено описание типа для файла: " + oType.get()))
                .getFull();

        String fileBaseTitle = FilenameUtils.getBaseName(baseFile.getTitle());
        String tmpPath = FilenameUtils.removeExtension(baseFile.getPath()).split("__")[0];
        List<File> allFiles = fileRepository.oneGroupFiles(tmpPath, fileBaseTitle.toLowerCase(), fileFullGroup);

        throwIfGroupNotFull(fileGroups.get(oType.get()).getRequired(), allFiles);

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", ContentDisposition.builder("attachment")
                                                                    .filename(fileBaseTitle + ".zip", UTF_8)
                                                                    .build().toString());

        makeZip(response, allFiles, fileBaseTitle, true);
    }

    private void makeZip(HttpServletResponse response,
                         List<File> files,
                         String baseName,
                         boolean withEcp) {
        try (ServletOutputStream sos = response.getOutputStream(); ZipOutputStream zos = new ZipOutputStream(sos)) {
            files.forEach(file -> {
                Path path = Path.of(file.getPath());
                String entryName = baseName + "." + FilenameUtils.getExtension(path.getFileName().toString());

                try {
                    addStreamToZip(zos, Files.newInputStream(path), entryName);

                    if (withEcp && file.getEcp() != null) {
                        addStreamToZip(zos,
                                       new ByteArrayResource(file.getEcp()).getInputStream(),
                                       file.getTitle() + ".sig");
                    }

                    zos.closeEntry();
                } catch (ZipException e) {
                    String message = e.getMessage();
                    if (!message.contains("duplicate entry")) {
                        String msg = String.format("Не удалось добавить файл %s в архив. Причина: %s",
                                                   entryName, e.getMessage());

                        throw new DataServiceException(msg);
                    }
                } catch (Exception e) {
                    String msg = String.format("Не удалось добавить файл %s в архив. Причина: %s",
                                               entryName, e.getMessage());

                    throw new DataServiceException(msg);
                }
            });
        } catch (Exception ex) {
            String msg = String.format("Не удалось создать zip архив. Причина: %s", ex.getMessage());
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    private File getFileOrThrow(UUID id) {
        orgSettingsKeeper.throwIfDownloadFileNotAllowed();

        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));

        if (!authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy())) {
            throwIfResourceNotAllowed(file);
        }

        return file;
    }

    private void addStreamToZip(ZipOutputStream zos, InputStream stream, String entryName) throws IOException {
        try (stream) {
            zos.putNextEntry(new ZipEntry(entryName));

            byte[] buffer = new byte[1024];
            int length;
            while ((length = stream.read(buffer)) >= 0) {
                zos.write(buffer, 0, length);
            }
        } catch (NoSuchFileException ex) {
            log.error("Не удалось добавить файл: '{}' в архив => {}", entryName, ex.getMessage());
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

    private void throwIfGroupNotFull(Set<String> required, List<File> files) {
        Set<String> requiredExt = setToLowerCase(required);
        Set<String> foundExtensions = files.stream()
                                           .map(file -> FilenameUtils.getExtension(file.getTitle()).toLowerCase())
                                           .collect(Collectors.toSet());

        requiredExt.forEach(ext -> {
            if (!foundExtensions.contains(ext)) {
                throw new BadRequestException("Группа файлов не полная. Не найден: " + ext);
            }
        });
    }
}
