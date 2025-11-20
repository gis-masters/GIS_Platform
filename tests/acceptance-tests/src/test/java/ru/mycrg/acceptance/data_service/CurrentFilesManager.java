package ru.mycrg.acceptance.data_service;

import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;

import java.util.UUID;

/**
 * Этот менеджер файлов, созданных во время выполнения сценария.
 * <p>
 * Надстройка над currentFiles
 */
public class CurrentFilesManager {

    /**
     * Ищет файл среди созданных во время прохождения сценария.
     *
     * @param title Тайтл фала
     *
     * @return FileDescriptionModel
     *
     * @throws IllegalStateException Если файл не найден
     */
    public static FileDescriptionModel getFileDescription(String title) {
        return FilesStepDefinitions.currentFiles
                .stream()
                .filter(file -> file.getTitle().equals(title))
                .findFirst()
                .orElseThrow(
                        () -> new IllegalStateException("Среди текущих файлов не найден искомый по title: " + title));
    }

    public static FileDescriptionModel getFileDescription(UUID id) {
        return FilesStepDefinitions.currentFiles
                .stream()
                .filter(file -> file.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Среди текущих файлов не найден искомый по id: " + id));
    }
}
