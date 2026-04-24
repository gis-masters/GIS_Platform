package ru.mycrg.data_service.util;

import org.springframework.util.StringUtils;
import ru.mycrg.data_service.entity.File;

import java.text.Normalizer;

public class FilenameDownloadUtil {

    private static final String INVALID_FILENAME_CHARS = "[\\p{Cntrl}<>:\"/\\\\|?*]";
    private static final String SAFE_FILENAME_CHAR = "_";
    private static final String DEFAULT_FILENAME = "file";

    public static String defineDownloadFilename(final String filename, final File file) {
        String normalizedFilename = normalizeFilename(filename);

        if (file == null) {
            return StringUtils.hasText(normalizedFilename)
                    ? normalizedFilename
                    : DEFAULT_FILENAME;
        }

        if (StringUtils.hasText(normalizedFilename)) {
            String normalizedExtension = normalizeFilename(file.getExtension());

            if (!StringUtils.hasText(normalizedExtension)) {
                return normalizedFilename;
            }

            return normalizedFilename + "." + normalizedExtension;
        }

        String normalizedTitle = normalizeFilename(file.getTitle());

        return StringUtils.hasText(normalizedTitle)
                ? normalizedTitle
                : DEFAULT_FILENAME;
    }

    private static String normalizeFilename(final String filename) {
        if (!StringUtils.hasText(filename)) {
            return "";
        }

        String normalized = Normalizer.normalize(filename.trim(), Normalizer.Form.NFC)
                                      .replaceAll(INVALID_FILENAME_CHARS, SAFE_FILENAME_CHAR)
                                      .replaceAll("\\s+", " ")
                                      .replaceAll("_+", SAFE_FILENAME_CHAR)
                                      .replaceAll("[. ]+$", "");

        if (!StringUtils.hasText(normalized) || ".".equals(normalized) || "..".equals(normalized)) {
            return "";
        }

        return normalized;
    }
}
