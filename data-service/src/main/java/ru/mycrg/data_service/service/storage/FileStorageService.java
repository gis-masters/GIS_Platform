package ru.mycrg.data_service.service.storage;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
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
import java.util.stream.Stream;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultOrganizationName;
import static ru.mycrg.data_service.service.storage.FileStorageUtil.calculateSize;
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

    @Autowired
    public FileStorageService(Environment environment,
                              IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;

        String kptStoragePath = environment.getRequiredProperty("crg-options.kptStoragePath");
        String mainStoragePath = environment.getRequiredProperty("crg-options.mainStoragePath");
        String exportStoragePath = environment.getRequiredProperty("crg-options.exportStoragePath");

        this.kptStoragePath = Paths.get(kptStoragePath).toAbsolutePath().normalize();
        this.mainStoragePath = Paths.get(mainStoragePath).toAbsolutePath().normalize();
        this.exportStoragePath = Paths.get(exportStoragePath).toAbsolutePath().normalize();

        this.trashPath = Paths.get(mainStoragePath + "/trash").toAbsolutePath().normalize();
        try {
            Files.createDirectories(trashPath);
        } catch (Exception e) {
            throw new DataServiceException("Не удалось создать каталог: " + trashPath, e);
        }

        long trashSize = calculateSize(trashPath);
        long mainStorageSize = calculateSize(this.mainStoragePath);
        long exportStorageSize = calculateSize(this.exportStoragePath);
        long kptStorageSize = calculateSize(this.kptStoragePath);
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
     * @throws DataServiceException в случае если не удается переместить файл
     */
    public Path moveToMainStorage(Path sourcePath, Path targetPath) {
        Path resultPath = null;
        try {
            resultPath = mainStoragePath.resolve(targetPath);

            log.info("Try move file from: [{}] to [{}]", sourcePath, resultPath);

            if (Files.exists(resultPath) && !sourcePath.equals(resultPath)) {
                Files.deleteIfExists(sourcePath);
            } else {
                Files.createDirectories(resultPath);
                Files.move(sourcePath, resultPath, REPLACE_EXISTING);
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
        Path targetPath = buildPathToOrganizationMainStorage();

        Map<String, Object> result = new HashMap<>();

        long totalFiles = 0;
        try (Stream<Path> filesStream = Files.walk(Paths.get(targetPath.toUri()))) {
            totalFiles = filesStream.parallel()
                                    .filter(p -> !p.toFile().isDirectory())
                                    .count();
        } catch (IOException e) {
            log.error("Не удалось подсчитать кол-во файлов в хранилище: '{}'", targetPath);
        }

        result.put("totalFiles", totalFiles);
        result.put("allocated", readableFileSize(calculateSize(targetPath)));

        return result;
    }

    public long mainStorageOccupiedSpace() {
        Path orgMainStoragePath = buildPathToOrganizationMainStorage();
        if (Files.notExists(orgMainStoragePath)) {
            try {
                Files.createDirectory(orgMainStoragePath);
            } catch (IOException e) {
                String msg = "Не удалось создать основное хранилище организации: " + orgMainStoragePath;
                log.error("{} => {}", msg, e.getMessage(), e);

                throw new DataServiceException(msg);
            }
        }

        return calculateSize(orgMainStoragePath);
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

    public String buildPathToExportStorage(String fileName) {
        return exportStoragePath + fileName;
    }

    private Path buildPathToOrganizationMainStorage() {
        return mainStoragePath.resolve(getDefaultOrganizationName(authenticationFacade.getOrganizationId()));
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
        String filenameExtension = StringUtils.getFilenameExtension(path);
        if (filenameExtension == null) {
            path = path + ".blob";
        }

        return path;
    }
}
