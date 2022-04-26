package ru.mycrg.data_service.service.binary_analyzers;

import org.jetbrains.annotations.Contract;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.entity.IRecord;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.INTENTS;

@Component
public class SimpleIntentHandler implements IBinaryIntentHandler {

    @Override
    @Contract(mutates = "this")
    public void updateIntents(IRecord record) {
        String fileType = record.getFileType();
        if ("gml".equals(fileType)) {
            record.setValue(INTENTS.getName(), "PROJECT");
        }

        if ("tif".equals(fileType)) {
            record.setValue(INTENTS.getName(), "PROJECT");
        }
    }

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
