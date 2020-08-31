package ru.mycrg.data_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.DataServiceInternalException;
import ru.mycrg.data_service.exceptions.NotFoundException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path documentStorageLocation;

    private final String FILE_EXTENSION = ".blob";

    @Autowired
    public FileStorageService(Environment environment) {
        String path = environment.getRequiredProperty("crg-options.fileStoragePath");

        documentStorageLocation = Paths.get(path).toAbsolutePath().normalize();

        try {
            Files.createDirectories(documentStorageLocation);
        } catch (Exception e) {
            throw new DataServiceException("Could not create the directory for the uploaded documents.", e);
        }
    }

    public String storeFile(MultipartFile file, String fileName) {
        Path targetLocation = null;
        try {
            // Copy file to the target location (Replacing existing file with the same name)
            targetLocation = documentStorageLocation.resolve(fileName + FILE_EXTENSION);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return targetLocation.normalize().toString();
        } catch (IOException e) {
            throw new DataServiceException("Could not store file: " + targetLocation.toString(), e);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = documentStorageLocation.resolve(fileName + FILE_EXTENSION).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new NotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new NotFoundException("File not found " + fileName, ex);
        }
    }

    public void removeFile(String fileName) {
        try {
            Path path = documentStorageLocation.resolve(fileName + FILE_EXTENSION).normalize();
            Files.delete(path);
        } catch (NoSuchFileException e) {
            throw new NotFoundException("File not found: " + fileName, e);
        } catch (IOException e) {
            throw new DataServiceInternalException("Cant delete file: " + fileName, e);
        }
    }
}
