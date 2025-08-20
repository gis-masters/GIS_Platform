package ru.mycrg.data_service.service.storage;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.springframework.util.StringUtils.getFilename;
import static org.springframework.util.StringUtils.getFilenameExtension;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultOrganizationName;
import static ru.mycrg.data_service.service.storage.FileStorageUtil.readableFileSize;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Service
public class FileStorageService {

    private final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final Path trashPath;
    private final Path mainStoragePath;
    private final Path exportStoragePath;
    private final Path kptStoragePath;

    private final IAuthenticationFacade authenticationFacade;
    private final StorageOccupiedSpaceService occupiedSpaceService;

    @Autowired
    public FileStorageService(Environment environment,
                              IAuthenticationFacade authenticationFacade,
                              StorageOccupiedSpaceService occupiedSpaceService) {
        String kptStoragePath = environment.getRequiredProperty("crg-options.kptStoragePath");
        String mainStoragePath = environment.getRequiredProperty("crg-options.mainStoragePath");
        String exportStoragePath = environment.getRequiredProperty("crg-options.exportStoragePath");

        this.authenticationFacade = authenticationFacade;
        this.occupiedSpaceService = occupiedSpaceService;
        this.kptStoragePath = Paths.get(kptStoragePath).toAbsolutePath().normalize();
        this.mainStoragePath = Paths.get(mainStoragePath).toAbsolutePath().normalize();
        this.exportStoragePath = Paths.get(exportStoragePath).toAbsolutePath().normalize();

        this.trashPath = Paths.get(mainStoragePath + "/trash").toAbsolutePath().normalize();
        try {
            Files.createDirectories(trashPath);
        } catch (Exception e) {
            throw new DataServiceException("Не удалось создать каталог: " + trashPath, e);
        }

        long trashSize = occupiedSpaceService.calculateSize(trashPath);
        long mainStorageSize = occupiedSpaceService.calculateSize(this.mainStoragePath);
        long exportStorageSize = occupiedSpaceService.calculateSize(this.exportStoragePath);
        long kptStorageSize = occupiedSpaceService.calculateSize(this.kptStoragePath);
        long allOccupied = trashSize + mainStorageSize + exportStorageSize + kptStorageSize;

        log.info("Отчет по занятому месту: \n" +
                         "Карзина: {} \n" +
                         "Основное хранилище: {} \n" +
                         "Хранилище для экспорта файлов: {} \n" +
                         "Хранилище КПТ: {} \n" +
                         "Всего: {}",
                 readableFileSize(trashSize), readableFileSize(mainStorageSize), readableFileSize(exportStorageSize),
                 readableFileSize(kptStorageSize), readableFileSize(allOccupied));
    }

    /**
     * Сохранить файл.
     * <p>
     * Сохраняем файл во временную папку trash
     *
     * @param file     Файл
     * @param fileName Имя файла под которым хотим сохранить файл
     *
     * @return Путь к файлу
     *
     * @throws DataServiceException в случае если не удается сохранить файл
     */
    public String copyToTrash(MultipartFile file, String fileName) {
        return copyTo(file, trashPath, fileName);
    }

    public String copyToExportStorage(MultipartFile file, String fileName) {
        return copyTo(file, exportStoragePath, fileName);
    }

    /**
     * Перемещение файла.
     * <p>
     *
     * @param sourcePath Путь откуда перемещаем файл
     * @param targetPath Путь куда перемещаем файл
     *
     * @param organizationId
     * @throws DataServiceException в случае если не удается переместить файл
     */
    public Path moveToMainStorage(Path sourcePath, Path targetPath, Long organizationId) {
        Path resultPath = null;
        try {
            resultPath = mainStoragePath.resolve(targetPath);

            log.debug("Перемещаем файл из временного каталога в основное хранилище: [{}] в [{}]",
                      sourcePath, resultPath);

            if (Files.exists(resultPath)) {
                if (!sourcePath.equals(resultPath)) {
                    moveWithReplace(sourcePath, resultPath, organizationId);
                } else {
                    log.debug("Пути одинаковы: : [{}] в [{}] только удаляем источник", sourcePath, resultPath);

                    Files.deleteIfExists(sourcePath);
                }
            } else {
                Files.createDirectories(resultPath);
                log.info("Создали каталог: [{}]", resultPath);

                moveWithReplace(sourcePath, resultPath, organizationId);
            }

            return resultPath;
        } catch (AccessDeniedException e) {
            String msg = "Нет доступа к ресурсу: " + resultPath;
            log.error(msg);

            throw new DataServiceException(msg);
        } catch (Exception e) {
            String msg = String.format("Не удалось переместить файл из: '%s' в: '%s'. Возникла ошибка: %s",
                                       sourcePath, resultPath, e.getMessage());
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    public Resource loadFromExportStorage(String fileName) {
        try {
            Path filePath = exportStoragePath.resolve(fileName).normalize();
            log.debug("Попытка загрузить файл: '{}' из exportStorage", filePath);

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            }

            log.error("В хранилище exportStorage, не найден файл: {}", fileName);
            throw new NotFoundException(fileName);
        } catch (MalformedURLException e) {
            log.error("В хранилище exportStorage, не найден ресурс: {}", fileName);
            throw new NotFoundException(fileName);
        }
    }

    public Resource loadFromMainStorage(String path) throws MalformedURLStorageException, NoSuchFileStorageException {
        try {
            Path filePath = mainStoragePath.resolve(addDefaultExtension(path)).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new NoSuchFileStorageException(path);
            }
        } catch (MalformedURLException e) {
            throw new MalformedURLStorageException(path, e);
        }
    }

    public File loadFromKptStorage(String fileName) throws IOException {
        Path filePath = kptStoragePath.resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists()) {
            log.debug("Успешно нашли КПТ архив");
        } else {
            log.error("Ресурс {} не существует", kptStoragePath);
            throw new NotFoundException(kptStoragePath);
        }

        return resource.getFile();
    }

    /**
     * На данный момент подсчитываем только в главном хранилище.
     */
    public Map<String, Object> occupiedSpace() {
        Path orgMainStoragePath = buildPathToOrganizationMainStorage(authenticationFacade.getOrganizationId());

        Map<String, Object> result = new HashMap<>();
        result.put("totalFiles", occupiedSpaceService.getTotalFiles(orgMainStoragePath));
        result.put("allocated", readableFileSize(mainStorageOccupiedSpace()));

        return result;
    }

    public long mainStorageOccupiedSpace() {
        Path orgMainStoragePath = buildPathToOrganizationMainStorage(authenticationFacade.getOrganizationId());

        // TODO: Это действие тоже много может отнять ресурсов процессора
        createOrgMainStorageIfNotExist(orgMainStoragePath);

        return occupiedSpaceService.calculateSize(orgMainStoragePath);
    }

    private void moveWithReplace(Path sourcePath, Path resultPath, Long organizationId) throws IOException {
        Files.move(sourcePath, resultPath, REPLACE_EXISTING);

        log.debug("Перемещение с заменой выполнено успешно: [{}] в [{}]", sourcePath, resultPath);

        occupiedSpaceService.evictCacheOccupiedSpace(buildPathToOrganizationMainStorage(
                organizationId));

        occupiedSpaceService.evictCacheTotalFiles(buildPathToOrganizationMainStorage(
                organizationId));
    }

    public void deleteIfExists(String path) throws StorageException {
        try {
            Path filePath = mainStoragePath.resolve(addDefaultExtension(path)).normalize();

            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new StorageException("Cant delete file: " + path, e);
        }
    }

    public List<String> getExistKptArchives() throws StorageException {
        return getFileNamesFromDirectory(kptStoragePath.toUri());
    }

    public Path getExportStoragePath() {
        return exportStoragePath;
    }

    public void rename(String pathFrom, String pathTo) throws StorageException {
        try {
            new File(pathFrom).renameTo(new File(pathTo));
        } catch (Exception e) {
            String msg = String.format("Не удалось переименовать файл: '%s' в: '%s' => '%s'",
                                       getFilename(pathFrom), getFilename(pathTo), e.getMessage());

            throw new StorageException(msg + " => " + e.getMessage(), e.getCause());
        }
    }

    public Path getTrashPath() {
        return trashPath;
    }

    private void createOrgMainStorageIfNotExist(Path orgMainStoragePath) {
        if (!Files.notExists(orgMainStoragePath)) {
            return;
        }

        try {
            Files.createDirectory(orgMainStoragePath);
        } catch (IOException e) {
            String msg = "Не удалось создать основное хранилище организации: " + orgMainStoragePath;
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new DataServiceException(msg);
        }
    }

    private Path buildPathToOrganizationMainStorage(Long organizationId) {
        return mainStoragePath.resolve(getDefaultOrganizationName(organizationId));
    }

    private String copyTo(MultipartFile file, Path storagePath, String fileName) {
        Path targetLocation = null;
        try {
            // Copy file to the target location (Replacing existing file with the same name)
            targetLocation = storagePath.resolve(fileName);

            Files.copy(file.getInputStream(), targetLocation, REPLACE_EXISTING);

            return targetLocation.normalize().toString();
        } catch (AccessDeniedException e) {
            String msg = "Нет доступа на сохранение файла, по пути: " + targetLocation;
            logError(msg, e);

            throw new DataServiceException(msg, e);
        } catch (Exception e) {
            String msg = "Не удалось сохранить файл, по пути: " + targetLocation;
            logError(msg, e);

            throw new DataServiceException(msg, e);
        }
    }

    private List<String> getFileNamesFromDirectory(URI targetUri) throws StorageException {
        try {
            File[] files = new File(targetUri).listFiles();
            if (files == null || files.length == 0) {
                return new ArrayList<>();
            }

            return Arrays.stream(files)
                         .map(File::getName)
                         .collect(Collectors.toList());
        } catch (Exception e) {
            String msg = "Не удалось прочитать файлы в каталоге: " + kptStoragePath;
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new StorageException(msg);
        }
    }

    @NotNull
    private String addDefaultExtension(String path) {
        // если имя файла без расширения, то добавить .blob
        // как временный кастыль со времен когда в БД хранилось имя файла без расширения
        String filenameExtension = getFilenameExtension(path);
        if (filenameExtension == null) {
            path = path + ".blob";
        }

        return path;
    }
}
