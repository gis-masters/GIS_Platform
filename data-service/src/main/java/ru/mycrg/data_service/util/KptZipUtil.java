package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;

import java.util.Enumeration;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import static ru.mycrg.data_service.util.DetailedLogger.logError;

public class KptZipUtil {

    /**
     * Достаем из архива первый попавшийся XML файл с названием "report".
     *
     * @param zip Zip архив
     */
    public static Optional<ZipEntry> extractXmlReport(@NotNull ZipFile zip) {
        try {
            Enumeration<? extends ZipEntry> entries = zip.entries();

            ZipEntry xmlEntry = null;
            while (entries.hasMoreElements()) {
                ZipEntry entry = entries.nextElement();
                if (entry.getName().startsWith("report")) {
                    String[] parts = entry.getName().split("\\.");
                    if ("xml".equals(parts[parts.length - 1])) {
                        xmlEntry = entry;
                        break;
                    }
                }
            }

            return Optional.ofNullable(xmlEntry);
        } catch (Exception e) {
            logError("Не удалось достать КПТ отчет из архива: " + zip.getName(), e);

            return Optional.empty();
        }
    }
}
