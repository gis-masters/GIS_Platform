package ru.mycrg.acceptance.data_service;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

public class TestFilesManager {

    @NotNull
    public static File getFile(String fileName) {
        Path resourcesPath = Paths.get("src/test/resources/ru/mycrg/acceptance/resources/");

        Optional<File> foundFile = findFileRecursively(resourcesPath.toFile(), fileName);
        if (foundFile.isPresent()) {
            return foundFile.get();
        }

        throw new IllegalStateException("Указанный ресурс не найден: " + fileName);
    }

    private static Optional<File> findFileRecursively(File directory, String fileName) {
        File[] files = directory.listFiles();
        if (files == null) {
            return Optional.empty();
        }

        for (File file: files) {
            if (file.isFile() && file.getName().equals(fileName)) {
                return Optional.of(file);
            }
        }

        for (File file: files) {
            if (file.isDirectory()) {
                Optional<File> foundFile = findFileRecursively(file, fileName);
                if (foundFile.isPresent()) {
                    return foundFile;
                }
            }
        }

        return Optional.empty();
    }

    public static FileDescriptionModel getFileDescriptionByTitleOrThrow(String title) {
        return FilesStepDefinitions.currentFiles
                .stream()
                .filter(file -> file.getTitle().equals(title))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Среди текущих файлов не найден искомый: " + title));
    }
}
