package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.config.CrgProperties;
import ru.mycrg.gis.exceptions.FileNotFoundException;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class GmlStorageService {

    private static Logger log = LoggerFactory.getLogger(GmlStorageService.class);

    private final Path gmlStoragePath;

    public GmlStorageService(CrgProperties properties) {
        this.gmlStoragePath = Paths.get(properties.getGmlStoragePath())
                .toAbsolutePath()
                .normalize();
    }

    /**
     * Загрузка файла.
     *
     * @param fileName Имя файла.
     * @return Файл как ресурс.
     */
    public Resource load(String fileName) {
        try {
            Path filePath = gmlStoragePath.resolve(fileName).normalize();
            log.debug("Try load file: {}", filePath);

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                log.debug("Success loaded");

                return resource;
            } else {
                log.error("File not found");
                throw new FileNotFoundException("File not found: " + fileName);
            }
        } catch (MalformedURLException e) {
            log.error("File not found");
            throw new FileNotFoundException("File not found " + fileName, e);
        }
    }

}
