package ru.mycrg.data_service.service.storage;

import org.jetbrains.annotations.NotNull;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStoragePath;

    @Autowired
    public FileStorageService(Environment environment) {
        String path = environment.getRequiredProperty("crg-options.fileStoragePath");

        fileStoragePath = Paths.get(path).toAbsolutePath().normalize();

        try {
            Files.createDirectories(fileStoragePath);
        } catch (Exception e) {
            throw new DataServiceException("Could not create the directory for the uploaded documents.", e);
        }
    }

    /**
     * Сохранить файл.
     *
     * @param file     Файл
     * @param fileName Имя файла под которым хотим сохранить файл
     *
     * @return Путь к файлу
     *
     * @throws DataServiceException в случае если не удается сохранить файл
     */
    public String storeFile(MultipartFile file, String fileName) {
        Path targetLocation = null;
        try {
            // Copy file to the target location (Replacing existing file with the same name)
            targetLocation = fileStoragePath.resolve(fileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return targetLocation.normalize().toString();
        } catch (Exception e) {
            throw new DataServiceException("Could not store file: " + targetLocation, e);
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
