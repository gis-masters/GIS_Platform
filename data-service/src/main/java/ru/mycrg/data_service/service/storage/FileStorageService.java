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
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Service
public class FileStorageService {

    private final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final Path fileTrashPath;
    private final Path fileStoragePath;
    private final Path exportStoragePath;
    private final Path kptArchivesPath;

    @Autowired
    public FileStorageService(Environment environment) {
        String path = environment.getRequiredProperty("crg-options.fileStoragePath");
        String exportStoragePath = environment.getRequiredProperty("crg-options.exportStoragePath");
        String kptArchivesPath = environment.getRequiredProperty("crg-options.kptArchivesPath");

        this.fileStoragePath = Paths.get(path).toAbsolutePath().normalize();
        this.fileTrashPath = Paths.get(path + "/trash").toAbsolutePath().normalize();
        this.exportStoragePath = Paths.get(exportStoragePath)
                                      .toAbsolutePath()
                                      .normalize();
        this.kptArchivesPath = Paths.get(kptArchivesPath).toAbsolutePath().normalize();

        try {
            Files.createDirectories(fileTrashPath);
        } catch (Exception e) {
            throw new DataServiceException("Could not create the directory for the uploaded documents.", e);
        }
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
    public String storeFile(MultipartFile file, String fileName) {
        return storeFile(file, fileTrashPath, fileName);
    }

    public String storeFile(MultipartFile file, Path storagePath, String fileName) {
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

    public Resource load(String fileName) {
        try {
            Path filePath = exportStoragePath.resolve(fileName).normalize();
            log.debug("Try load file: {}", filePath);

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                log.debug("Success loaded");

                return resource;
            } else {
                log.error("Resource not exist");
                throw new NotFoundException(fileName);
            }
        } catch (MalformedURLException e) {
            log.error("File not found", e);
            throw new NotFoundException(fileName);
        }
    }

    public Resource loadAsResource(String path) throws MalformedURLStorageException, NoSuchFileStorageException {
        try {
            Path filePath = fileStoragePath.resolve(addDefaultExtension(path)).normalize();
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

    public File loadKptArchive(String fileName) throws IOException {
        Path filePath = kptArchivesPath.resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists()) {
            log.debug("Успешно нашли КПТ архив");
        } else {
            log.error("Ресурс {} не существует", kptArchivesPath);
            throw new NotFoundException(kptArchivesPath);
        }
        return resource.getFile();
    }

    public void deleteIfExists(String path) throws StorageException {
        try {
            Path filePath = fileStoragePath.resolve(addDefaultExtension(path)).normalize();

            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new StorageException("Cant delete file: " + path, e);
        }
    }

    @NotNull
    public String generateFileName(MultipartFile file) {
        return String.format("%s.%s",
                             UUID.randomUUID().toString().substring(0, 13),
                             StringUtils.getFilenameExtension(file.getOriginalFilename()));
    }

    public List<String> getNonExistentFileNames(List<String> fileNames) throws StorageException, IOException {
        File directory = getKptArchiveDirectory();
        File[] existKptArchives = directory.listFiles();
        if (existKptArchives == null) {
            throw new StorageException(kptArchivesPath + " не существует");
        }
        if (existKptArchives.length == 0) {
            throw new StorageException(kptArchivesPath + " не имеет файлов");
        }
        List<String> exisingFileNames = Arrays.stream(existKptArchives)
                .map(File::getName).collect(Collectors.toList());

        return fileNames.stream()
                .filter(fileName -> !exisingFileNames.contains(fileName))
                .collect(Collectors.toList());
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
    public void moveFile(Path sourcePath, Path targetPath) {
        try {
            log.info("Try move file from: [{}] to [{}]", sourcePath, targetPath);

            if (Files.exists(targetPath)) {
                Files.deleteIfExists(sourcePath);
            } else {
                Files.createDirectories(targetPath);
                Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (AccessDeniedException e) {
            String msg = "Нет доступа к ресурсу: " + targetPath;
            log.error(msg);

            throw new DataServiceException(msg);
        } catch (Exception e) {
            String msg = String.format("Не удалось переместить файл из: '%s' в: '%s'. Возникла ошибка: %s",
                                       sourcePath, targetPath, e.getMessage());
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    private File getKptArchiveDirectory() throws IOException {
        Resource resource = new UrlResource(kptArchivesPath.toUri());
        if (resource.exists()) {
            log.debug("Успешно нашли папку с архивами КПТ");
        } else {
            log.error("Ресурс не существует");
            throw new NotFoundException(kptArchivesPath);
        }
        return resource.getFile();
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
