package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class CrgFileUtil {

    private CrgFileUtil() {
        throw new IllegalStateException("Utility class");
    }

    @NotNull
    public static String getFileExtension(MultipartFile file) {
        String name = file.getOriginalFilename();
        if (name == null) {
            return "";
        }

        int lastIndexOf = name.lastIndexOf(".");
        if (lastIndexOf == -1) {
            String contentType = file.getContentType();

            return contentType != null ? contentType : "";
        }

        return name.substring(lastIndexOf + 1);
    }

}
