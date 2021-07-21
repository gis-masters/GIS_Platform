package ru.mycrg.data_service.service.import_;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

public interface Importer {

    String getType();

    Long doImport(MultipartFile file, ResourceQualifier rIdentifier);
}
