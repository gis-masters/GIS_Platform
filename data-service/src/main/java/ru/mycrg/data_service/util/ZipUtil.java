package ru.mycrg.data_service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.NoSuchFileException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipUtil {

    private static final Logger log = LoggerFactory.getLogger(ZipUtil.class);

    private ZipUtil() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Добавляет поток данных в ZIP архив.
     *
     * @param zos       ZIP поток для записи
     * @param stream    входной поток данных
     * @param entryName имя записи в архиве
     *
     * @throws IOException если произошла ошибка при записи
     */
    public static void addStreamToZip(ZipOutputStream zos, InputStream stream, String entryName) throws IOException {
        try (stream) {
            zos.putNextEntry(new ZipEntry(entryName));

            byte[] buffer = new byte[1024];
            int length;
            while ((length = stream.read(buffer)) >= 0) {
                zos.write(buffer, 0, length);
            }
        } catch (NoSuchFileException ex) {
            log.error("Не удалось добавить файл: '{}' в архив => {}", entryName, ex.getMessage());
        }
    }
}
