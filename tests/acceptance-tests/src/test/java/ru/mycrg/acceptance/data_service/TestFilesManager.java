package ru.mycrg.acceptance.data_service;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;

import java.io.File;

public class TestFilesManager {

    @NotNull
    public static File getFile(String fileName) {
        File testFile = new File("src/test/resources/ru/mycrg/acceptance/resources/" + fileName);
        if (!testFile.exists()) {
            throw new IllegalStateException("Not exist test resource: " + fileName);
        }

        return testFile;
    }

    public static FileDescriptionModel getFileDescriptionByTitleOrThrow(String title) {
        return FilesStepDefinitions.currentFiles
                .stream()
                .filter(file -> file.getTitle().equals(title))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Среди текущих файлов не найден искомый: " + title));
    }
}
