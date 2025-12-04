package ru.mycrg.report_service.services;

import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

@Component
public class FileService {

    //TODO: вынести в переменную, либо переделать DOCKERFILE
    //private static final String TEMPLATES_DIR = "/app/templates/";
    //new ClassPathResource
    private static final String TEMPLATES_DIR = "report-service/src/main/resources/";

    public File throwIfNotExist(String fileName) throws FileNotFoundException {
        File file = new File(TEMPLATES_DIR + fileName);

        if (!file.exists()) {
            throw new FileNotFoundException(("Файл '" + fileName + "' не найден!"));
        }

        if (!file.isFile()) {
            throw new FileNotFoundException("По имени: " + fileName + ". Найдена папка, а не файл!");
        }

        return file;
    }

    public File createFileCopy(File file) throws Exception {
        String fileName = file.getName();
        String extension = fileName.substring(fileName.lastIndexOf("."));
        File tempFile = File.createTempFile("template-", extension);
        tempFile.deleteOnExit();

        try (FileInputStream fis = new FileInputStream(file);
             FileOutputStream fos = new FileOutputStream(tempFile)) {
            fis.transferTo(fos);
            fos.flush();
        }

        return tempFile;
    }
}
