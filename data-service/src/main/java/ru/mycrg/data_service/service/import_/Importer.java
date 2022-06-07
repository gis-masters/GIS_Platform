package ru.mycrg.data_service.service.import_;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

public interface Importer<T> {

    String getType();

    T doImport(MultipartFile file, ResourceQualifier rIdentifier);
}
