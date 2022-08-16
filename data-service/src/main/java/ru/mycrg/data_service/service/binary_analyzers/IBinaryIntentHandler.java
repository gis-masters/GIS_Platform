package ru.mycrg.data_service.service.binary_analyzers;

import org.springframework.web.multipart.MultipartFile;

public interface IBinaryIntentHandler {

    String defineIntent(MultipartFile file);
}
