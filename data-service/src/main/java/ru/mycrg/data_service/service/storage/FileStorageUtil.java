package ru.mycrg.data_service.service.storage;

import org.jetbrains.annotations.NotNull;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.text.DecimalFormat;
import java.util.UUID;

import static ru.mycrg.common_utils.CrgGlobalProperties.joinByDouble;

public class FileStorageUtil {

    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("#,##0.#");
    private static final String[] UNITS = new String[]{"B", "Kb", "Mb", "Gb", "Tb"};

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

    @NotNull
    public static String generateFileName(MultipartFile file) {
        int fileHashCode = file.hashCode();

        return String.format("%s.%s",
                             joinByDouble(UUID.randomUUID().toString().substring(0, 13), String.valueOf(fileHashCode)),
                             StringUtils.getFilenameExtension(file.getOriginalFilename())).toLowerCase();
    }
}
