package ru.mycrg.report_service.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class FileService {

    public static final String TEMPLATES_DIR = "report-service/src/main/resources/ready_to_work";

    private static final Logger log = LoggerFactory.getLogger(FileService.class);

    public File throwIfNotExist(String filePath) throws FileNotFoundException {
        File file = new File(filePath);

        if (!file.exists()) {
            throw new FileNotFoundException(("Файл '" + filePath + "' не найден!"));
        }

        if (!file.isFile()) {
            throw new FileNotFoundException("По имени: " + filePath + ". Найдена папка, а не файл!");
        }

        return file;
    }

    public File createFileCopy(String fileName, byte[] bytes) throws Exception {
        String extension = fileName.substring(fileName.lastIndexOf("."));
        File tempFile = File.createTempFile("template-", extension);
        tempFile.deleteOnExit();

        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(bytes);
            fos.flush();
        }

        return tempFile;
    }

    public Resource loadFileByPath(String filePath) throws Exception {
        Path path = Paths.get(filePath);
        Resource resource = new UrlResource(path.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            log.error("Файл не найден или недоступен для чтения: {}", filePath);

            throw new FileNotFoundException("Файл не найден или недоступен для чтения: " + filePath);
        }
    }

    public void deleteByPath(String filePath) {
        File file = new File(filePath);

        if (!file.exists()) {
            log.warn("Файл для удаления не найден: {}", filePath);
            return;
        }

        if (!file.isFile()) {
            log.warn("Путь не является файлом: {}", filePath);
            return;
        }

        boolean deleted = file.delete();

        if (deleted) {
            log.info("Файл успешно удалён: {}", filePath);
        } else {
            log.error("Не удалось удалить файл: {}", filePath);
        }
    }

    public String saveInMainPath(MultipartFile file) throws IOException {
        // Формируем полный путь для сохранения
        String originalFileName = file.getOriginalFilename();
        String destinationPath = TEMPLATES_DIR + "/" + originalFileName;
        Path path = Paths.get(destinationPath);

        // Создаём директорию если не существует
        File parentDir = path.getParent().toFile();
        if (!parentDir.exists()) {
            boolean created = parentDir.mkdirs();
            if (!created) {
                throw new IOException("Не удалось создать директорию: " + parentDir.getAbsolutePath());
            }
        }

        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        log.info("Файл успешно сохранён: {}", destinationPath);

        return destinationPath;
    }

    /**
     * Используется в миграциях
     *
     * @param path    - директория для поиска (без рекурсивного поиска)
     * @param pattern - паттерн для поиска
     *
     * @return List найденных файлов, либо пустой лист
     */
    public List<File> getFilesByPathWithPattern(String path, Pattern pattern) {
        List<File> matchedFiles = new ArrayList<>();

        File directory = new File(path);

        // Проверяем, что путь существует и это директория
        if (!directory.exists()) {
            log.warn("Директория не существует: {}", path);
            return matchedFiles;
        }

        if (!directory.isDirectory()) {
            log.warn("Путь не является директорией: {}", path);
            return matchedFiles;
        }

        // Получаем все файлы в директории
        File[] files = directory.listFiles();

        if (files == null) {
            log.warn("Не удалось получить список файлов из директории: {}", path);
            return matchedFiles;
        }

        // Фильтруем файлы по паттерну
        for (File file: files) {
            if (file.isFile() && pattern.matcher(file.getName()).matches()) {
                matchedFiles.add(file);
                log.debug("Найден файл: {}", file.getName());
            }
        }

        log.info("Найдено {} файлов, соответствующих паттерну в директории: {}", matchedFiles.size(), path);

        return matchedFiles;
    }

    public String copyFileByPathInMainStorage(String sourceFilePath) throws Exception {
        File sourceFile = new File(sourceFilePath);

        // Проверяем существование исходного файла
        if (!sourceFile.exists()) {
            throw new FileNotFoundException("Исходный файл не найден: " + sourceFilePath);
        }

        if (!sourceFile.isFile()) {
            throw new FileNotFoundException("Путь не является файлом: " + sourceFilePath);
        }

        // Извлекаем имя файла
        String fileName = sourceFile.getName();

        // Формируем путь назначения
        String destinationPath = TEMPLATES_DIR + "/" + fileName;
        File destinationFile = new File(destinationPath);

        // Создаём директорию если не существует
        File parentDir = destinationFile.getParentFile();
        if (!parentDir.exists()) {
            parentDir.mkdirs();
        }

        // Копируем файл
        try {
            Files.copy(sourceFile.toPath(), destinationFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            log.info("Файл скопирован: {} -> {}", sourceFilePath, destinationPath);
        } catch (IOException e) {
            log.error("Ошибка копирования файла: {}", e.getMessage());

            throw new RuntimeException("Не удалось скопировать файл: " + sourceFilePath, e);
        }

        // Возвращаем путь к скопированному файлу
        return destinationPath;
    }
}
