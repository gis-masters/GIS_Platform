package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.config.CrgProperties;
import ru.mycrg.gis.exceptions.NotFoundException;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class StorageService {

    private static final Logger log = LoggerFactory.getLogger(StorageService.class);

    private final Path exportStoragePath;

    public StorageService(CrgProperties properties) {
        this.exportStoragePath = Paths.get(properties.getExportStoragePath())
                                      .toAbsolutePath()
                                      .normalize();
    }

    /**
     * Загрузка файла.
     *
     * @param fileName Имя файла.
     *
     * @return Файл как ресурс.
     */
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
}
