package ru.mycrg.wrapper.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.config.CrgProperties;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.io.File.separator;

@Service
public class FileService {

    private final Path exportStoragePath;

    public FileService(CrgProperties properties) {
        this.exportStoragePath = Paths.get(properties.getExportStoragePath())
                .toAbsolutePath()
                .normalize();
    }

    @NotNull
    public String getPathToFile(String fileName) {
        File file = new File(exportStoragePath + separator + fileName);
        if (file.exists() && !file.isDirectory()) {
            return file.getAbsolutePath();
        }

        return "";
    }

    public Path getExportStoragePath() {
        return exportStoragePath;
    }

}
