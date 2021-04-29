package ru.mycrg.data_service.service.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
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

@Service
public class FileStorageService {

    private final Path fileStoragePath;

    private static final String FILE_EXTENSION = ".blob";

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

    public String storeFile(MultipartFile file, String fileName) {
        Path targetLocation = null;
        try {
            // Copy file to the target location (Replacing existing file with the same name)
            targetLocation = fileStoragePath.resolve(fileName + FILE_EXTENSION);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return targetLocation.normalize().toString();
        } catch (IOException e) {
            throw new DataServiceException("Could not store file: " + targetLocation.toString(), e);
        }
    }

    public Resource loadAsResource(String fileName) throws MalformedURLStorageException, NoSuchFileStorageException {
        try {
            Path filePath = fileStoragePath.resolve(fileName + FILE_EXTENSION).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new NoSuchFileStorageException(fileName);
            }
        } catch (MalformedURLException e) {
            throw new MalformedURLStorageException(fileName, e);
        }
    }

    public boolean deleteIfExists(String fileName) throws StorageException {
        try {
            Path filePath = fileStoragePath.resolve(fileName + FILE_EXTENSION).normalize();

            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new StorageException("Cant delete file: " + fileName, e);
        }
    }
}
