package ru.mycrg.data_service.controller.file;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.controller.BaseController;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service.service.resources.protectors.IFileResourceProtector;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.zip.ZipOutputStream;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpHeaders.CONTENT_LENGTH;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.ZipUtil.addStreamToZip;

@RestController
@RequestMapping("/files")
public class FileDownloadController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(FileDownloadController.class);

    private final FileRepository fileRepository;
    private final OrgSettingsKeeper orgSettingsKeeper;
    private final FileStorageService fileStorageService;
    private final IFileResourceProtector fileResourceProtector;

    public FileDownloadController(FileRepository fileRepository,
                                  OrgSettingsKeeper orgSettingsKeeper,
                                  FileStorageService fileStorageService,
                                  IFileResourceProtector fileResourceProtector) {
        this.fileRepository = fileRepository;
        this.orgSettingsKeeper = orgSettingsKeeper;
        this.fileStorageService = fileStorageService;
        this.fileResourceProtector = fileResourceProtector;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/{id}/download")
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
    @GetMapping("/{id}/download/ecp")
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
    @GetMapping("/{id}/download/with-ecp")
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

    private File getFileOrThrow(UUID id) {
        // TODO: Втянуть это в fileResourceProtector как isDownloadAllowed
        orgSettingsKeeper.throwIfDownloadFileNotAllowed();

        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));

        if (!fileResourceProtector.isAllowed(file)) {
            throw new ForbiddenException("Файл недоступен");
        }

        return file;
    }
}
