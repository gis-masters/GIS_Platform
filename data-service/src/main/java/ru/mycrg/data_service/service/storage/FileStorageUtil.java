package ru.mycrg.data_service.service.storage;

import org.apache.commons.io.FileUtils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.io.File;
import java.nio.file.Path;
import java.text.DecimalFormat;
import java.util.UUID;

public class FileStorageUtil {

    private static final Logger log = LoggerFactory.getLogger(FileStorageUtil.class);

    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("#,##0.#");
    private static final String[] UNITS = new String[]{"B", "Kb", "Mb", "Gb", "Tb"};

    public static long calculateSize(Path targetFolder) {
        try {
            return FileUtils.sizeOfDirectory(new File(targetFolder.toUri()));
        } catch (Exception e) {
            log.error("Не удалось подсчитать размер каталога: {} => {}", targetFolder, e.getMessage());

            return 0;
        }
    }

    public static String readableFileSize(long size) {
        if (size < 1) {
            return "0";
        }

        int unitIndex = (int) (Math.log10(size) / 3);
        double unitValue = 1 << (unitIndex * 10);

        return DECIMAL_FORMAT.format(size / unitValue) + " " + UNITS[unitIndex];
    }

    @NotNull
    public static String generateFileName(String originalFilename) {
        return String.format("%s.%s",
                             UUID.randomUUID().toString().substring(0, 13),
                             StringUtils.getFilenameExtension(originalFilename));
    }
}
