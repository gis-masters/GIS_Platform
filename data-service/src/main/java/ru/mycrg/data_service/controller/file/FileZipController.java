package ru.mycrg.data_service.controller.file;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
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
import ru.mycrg.data_service_contract.enums.FileType;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.zip.ZipException;
import java.util.zip.ZipOutputStream;

import static java.nio.charset.StandardCharsets.UTF_8;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.files.FileService.fileGroups;
import static ru.mycrg.data_service.util.StringUtil.setToLowerCase;
import static ru.mycrg.data_service.util.ZipUtil.addStreamToZip;

@RestController
@RequestMapping("/files")
public class FileZipController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(FileZipController.class);

    private final FileRepository fileRepository;
    private final OrgSettingsKeeper orgSettingsKeeper;
    private final IFileResourceProtector fileResourceProtector;

    public FileZipController(FileRepository fileRepository,
                             OrgSettingsKeeper orgSettingsKeeper,
                             IFileResourceProtector fileResourceProtector) {
        this.fileRepository = fileRepository;
        this.fileResourceProtector = fileResourceProtector;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/{id}/download/zip")
    public void downloadZip(@PathVariable UUID id, HttpServletResponse response) {
        prepareAndDownloadZip(id, response, false);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/{id}/download/zip/with-ecp")
    public void downloadZipWithEcp(@PathVariable UUID id, HttpServletResponse response) {
        prepareAndDownloadZip(id, response, true);
    }

    private void prepareAndDownloadZip(UUID id,
                                       HttpServletResponse response,
                                       boolean withEcp) {
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

        makeZip(response, allFiles, fileBaseTitle, withEcp);
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
        // TODO: Втянуть это в fileResourceProtector как isDownloadAllowed
        orgSettingsKeeper.throwIfDownloadFileNotAllowed();

        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!fileResourceProtector.isAllowed(file)) {
            throw new ForbiddenException("Файл недоступен");
        }

        return file;
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
