package ru.mycrg.data_service.service.binary_analyzers;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class SimpleIntentHandler implements IBinaryIntentHandler {

    @Override
    public String defineIntent(MultipartFile file) {
        String contentType = file.getContentType();
        assert contentType != null;

        if (contentType.contains("gml") || contentType.contains("tif")) {
            return "PROJECT";
        } else {
            return "";
        }
    }
}
