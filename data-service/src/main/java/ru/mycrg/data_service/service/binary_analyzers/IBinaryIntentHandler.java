package ru.mycrg.data_service.service.binary_analyzers;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.entity.IRecord;

public interface IBinaryIntentHandler {

    void updateIntents(IRecord record);

    String defineIntent(MultipartFile file);
}
