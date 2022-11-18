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
import ru.mycrg.data_service.service.storage.exceptions.MalformedURLStorageException;
import ru.mycrg.data_service.service.storage.exceptions.NoSuchFileStorageException;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Service
public class FileStorageService {

    private final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final Path fileStoragePath;
    private final Path fileTrashPath;

    @Autowired
    public FileStorageService(Environment environment) {
        String path = environment.getRequiredProperty("crg-options.fileStoragePath");

        fileStoragePath = Paths.get(path).toAbsolutePath().normalize();
        fileTrashPath = Paths.get(path + "/trash").toAbsolutePath().normalize();

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

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

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

    public boolean deleteIfExists(String path) throws StorageException {
        try {
            Path filePath = fileStoragePath.resolve(addDefaultExtension(path)).normalize();

            return Files.deleteIfExists(filePath);
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
            Files.createDirectories(targetPath);
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            String msg = String.format("Не удалось переместить файл из: '%s' в: '%s'. Возникла ошибка: %s",
                                       sourcePath, targetPath, e.getMessage());
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    @NotNull
    private String addDefaultExtension(String path) {
        // если имя файла без расширения то добавить .blob
        // как временный кастыль со времен когда в БД хранилось имя файла без расширения
        String filenameExtension = StringUtils.getFilenameExtension(path);
        if (filenameExtension == null) {
            path = path + ".blob";
        }

        return path;
    }
}
