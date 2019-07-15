package ru.mycrg.wrapper.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.config.CrgProperties;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.io.File.separator;

@Service
public class FileService {

    private static final Logger log = LoggerFactory.getLogger(FileService.class);

    private final Path exprotStoragePath;

    public FileService(CrgProperties properties) {
        this.exprotStoragePath = Paths.get(properties.getExportStoragePath())
                .toAbsolutePath()
                .normalize();
    }

    @NotNull
    public String getPathToFile(String fileName) {
        File file = new File(exprotStoragePath + separator + fileName);
        if (file.exists() && !file.isDirectory()) {
            return file.getAbsolutePath();
        }

        return "";
    }

    public Path getExprotStoragePath() {
        return exprotStoragePath;
    }
}
